<template>
  <div>
    <el-card>
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="学号">
          <el-input v-model="searchForm.sid" placeholder="学号" clearable />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="姓名" clearable />
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="searchForm.className" placeholder="班级" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px;">
      <el-button type="primary" @click="handleAdd">新增学生</el-button>
      <el-table :data="tableData" style="margin-top: 10px;">
        <el-table-column prop="sid" label="学号" />
        <el-table-column prop="sname" label="姓名" />
        <el-table-column prop="sex" label="性别" />
        <el-table-column prop="sclass" label="班级" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" style="color:red;" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          v-model:current-page="page"
          v-model:page-size="size"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="fetchData"
          @size-change="fetchData"
      />
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="formData" label-width="80px">
        <el-form-item label="学号" v-if="!isEdit">
          <el-input v-model="formData.sid" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="formData.sname" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="formData.sex">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="formData.sclass" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formData.phone" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getStudentList, addStudent, updateStudent, deleteStudent } from '@/api/student'

const searchForm = reactive({ sid: '', name: '', className: '' })
const tableData = ref([])
const page = ref(1)
const size = ref(10)
const total = ref(0)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const formData = reactive({ sid: '', sname: '', sex: '男', sclass: '', phone: '' })

const fetchData = async () => {
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
      total.value = res.data.total || 0
    }
  } catch (error) {
    ElMessage.error('加载失败')
  }
}

const resetSearch = () => {
  searchForm.sid = ''
  searchForm.name = ''
  searchForm.className = ''
  fetchData()
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增学生'
  Object.assign(formData, { sid: '', sname: '', sex: '男', sclass: '', phone: '' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑学生'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await updateStudent(formData.sid, formData)
      ElMessage.success('更新成功')
    } else {
      await addStudent(formData)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除学号为 ${row.sid} 的学生吗？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
      .then(async () => {
        await deleteStudent(row.sid)
        ElMessage.success('删除成功')
        fetchData()
      })
      .catch(() => {})
}

onMounted(() => {
  fetchData()
})
</script>