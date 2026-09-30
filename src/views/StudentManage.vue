<template>
  <div>
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" @submit.prevent>
        <!-- 第一行：三个查询条件 -->
        <el-row :gutter="16">
          <el-col :xs="24" :sm="8">
            <el-form-item label="学号">
              <el-input v-model="searchForm.sid" placeholder="请输入学号" clearable @keyup.enter="handleSearch" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="姓名">
              <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable @keyup.enter="handleSearch" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="班级">
              <el-input v-model="searchForm.className" placeholder="请输入班级" clearable @keyup.enter="handleSearch" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行：操作按钮 -->
        <el-row>
          <el-col :span="24" class="search-actions">
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="card-head">
          <span>学生列表</span>
          <span class="card-sub">共 {{ total }} 条记录</span>
        </div>
      </template>

      <div class="table-toolbar">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增学生</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="sid" label="学号" width="120" />
        <el-table-column prop="sname" label="姓名" width="100" />
        <el-table-column prop="sex" label="性别" width="80" />
        <el-table-column prop="sclass" label="班级" min-width="120" />
        <el-table-column prop="jg" label="籍贯" min-width="100" />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column prop="enterTime" label="入学时间" width="120" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pager"
        v-model:current-page="page"
        v-model:page-size="size"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="fetchData"
        @size-change="handleSizeChange"
      />
    </el-card>

    <!-- 新增 / 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="520px">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="90px">
        <el-form-item label="学号" prop="sid">
          <el-input v-model="formData.sid" :disabled="isEdit" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="姓名" prop="sname">
          <el-input v-model="formData.sname" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="formData.sex">
            <el-radio value="男">男</el-radio>
            <el-radio value="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="班级" prop="sclass">
          <el-input v-model="formData.sclass" placeholder="如 计科2班" />
        </el-form-item>
        <el-form-item label="籍贯" prop="jg">
          <el-input v-model="formData.jg" placeholder="如 广东东莞" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="11 位手机号" maxlength="11" />
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker v-model="formData.birthday" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width:100%" />
        </el-form-item>
        <el-form-item label="入学时间" prop="enterTime">
          <el-date-picker v-model="formData.enterTime" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width:100%" />
        </el-form-item>
      </el-form>
      <el-alert
        v-if="!isEdit"
        type="info"
        :closable="false"
        show-icon
        title="新增学生时会自动创建登录账号：用户名 = 学号，默认密码 123456。"
      />
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { getStudentList, addStudent, updateStudent, deleteStudent } from '@/api/student'

const searchForm = reactive({ sid: '', name: '', className: '' })
const tableData = ref([])
const page = ref(1)
const size = ref(10)
const total = ref(0)
const loading = ref(false)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const saving = ref(false)
const formRef = ref(null)

const emptyForm = () => ({
  sid: '', sname: '', sex: '男', sclass: '', jg: '', phone: '', birthday: '', enterTime: ''
})
const formData = reactive(emptyForm())

const rules = {
  sid: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  sname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  sclass: [{ required: true, message: '请输入班级', trigger: 'blur' }],
  phone: [
    { pattern: /^\d{11}$/, message: '请输入 11 位手机号', trigger: 'blur' }
  ]
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getStudentList({
      page: page.value,
      size: size.value,
      sid: searchForm.sid || undefined,
      name: searchForm.name || undefined,
      className: searchForm.className || undefined
    })
    if (res.code === 200) {
      tableData.value = res.data.records || []
      total.value = Number(res.data.total) || 0
    } else {
      ElMessage.error(res.message || '加载失败')
    }
  } catch (error) {
    const data = error.response && error.response.data
    ElMessage.error((data && data.message) || '加载失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  page.value = 1
  fetchData()
}

const resetSearch = () => {
  Object.assign(searchForm, { sid: '', name: '', className: '' })
  page.value = 1
  fetchData()
}

const handleSizeChange = () => {
  page.value = 1
  fetchData()
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增学生'
  Object.assign(formData, emptyForm())
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑学生'
  Object.assign(formData, emptyForm(), row)
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch (e) {
    return
  }
  saving.value = true
  try {
    const res = isEdit.value
      ? await updateStudent(formData.sid, formData)
      : await addStudent(formData)
    if (res.code === 200) {
      ElMessage.success(res.data || '操作成功')
      dialogVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.message || '操作失败')
    }
  } catch (error) {
    const data = error.response && error.response.data
    ElMessage.error((data && data.message) || '操作失败')
  } finally {
    saving.value = false
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除学号为 ${row.sid} 的学生吗？其登录账号也会一并删除。`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        const res = await deleteStudent(row.sid)
        if (res.code === 200) {
          ElMessage.success('删除成功')
          fetchData()
        } else {
          ElMessage.error(res.message || '删除失败')
        }
      } catch (error) {
        const data = error.response && error.response.data
        ElMessage.error((data && data.message) || '删除失败')
      }
    })
    .catch(() => {})
}

onMounted(fetchData)
</script>

<style scoped>
.table-card {
  margin-top: 16px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-sub {
  font-size: 12px;
  font-weight: 400;
  color: #909399;
}

.table-toolbar {
  margin-bottom: 12px;
}

.pager {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
