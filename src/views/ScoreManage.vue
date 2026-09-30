<template>
  <div>
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" @submit.prevent>
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="学号">
              <el-input v-model="searchForm.sid" placeholder="学号" clearable @keyup.enter="handleSearch" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="姓名">
              <el-input v-model="searchForm.name" placeholder="姓名" clearable @keyup.enter="handleSearch" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="班级">
              <el-input v-model="searchForm.className" placeholder="班级" clearable @keyup.enter="handleSearch" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="课程">
              <el-select v-model="searchForm.cid" placeholder="全部课程" clearable style="width:100%">
                <el-option v-for="c in courses" :key="c.cid" :label="c.cname" :value="c.cid" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="search-actions">
            <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
            <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
            <el-button type="success" :icon="Plus" @click="openAddDialog(null)">录入成绩</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div v-loading="loading" class="result-area">
      <el-empty
        v-if="!loading && studentList.length === 0"
        description="暂无数据，请填写查询条件后点击「查询」，或直接点击「录入成绩」"
      />

      <el-card
        v-for="item in studentList"
        :key="item.student.sid"
        shadow="never"
        class="student-card"
      >
        <template #header>
          <div class="student-head">
            <span class="student-name">{{ item.student.sname }}</span>
            <el-tag size="small" type="info">学号：{{ item.student.sid }}</el-tag>
            <el-tag size="small" type="info">班级：{{ item.student.sclass || '未填写' }}</el-tag>
            <el-tag size="small" type="info">性别：{{ item.student.sex || '未填写' }}</el-tag>
            <div class="student-head-right">
              <el-button type="primary" link :icon="Plus" @click="openAddDialog(item.student)">
                为该生录入成绩
              </el-button>
            </div>
          </div>
        </template>

        <el-table :data="displayScores(item.scores)" style="width: 100%">
          <el-table-column prop="cname" label="课程" min-width="150" />
          <el-table-column prop="cid" label="课程编号" width="110" />
          <el-table-column prop="term" label="学期" width="110" />
          <el-table-column prop="usual" label="平时分" width="90" />
          <el-table-column prop="finalScore" label="期末分" width="90" />
          <el-table-column prop="total" label="总分" width="90" />
          <el-table-column label="操作" width="90" fixed="right">
            <template #default="{ row }">
              <el-button
                v-if="!row._empty"
                type="primary"
                link
                @click="openEditDialog(item.student, row)"
              >
                编辑
              </el-button>
              <span v-else>—</span>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="!item.scores || item.scores.length === 0" class="no-score-tip">
          该学员暂无成绩记录，可点击右上角「为该生录入成绩」新增。
        </div>
      </el-card>
    </div>

    <!-- 录入 / 编辑成绩 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="480px">
      <el-form ref="formRef" :model="scoreForm" :rules="rules" label-width="90px">
        <el-form-item label="学号" prop="sid">
          <el-input v-model="scoreForm.sid" :disabled="isEdit" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="课程" prop="cid">
          <el-select v-model="scoreForm.cid" :disabled="isEdit" placeholder="请选择课程" style="width:100%">
            <el-option
              v-for="c in courses"
              :key="c.cid"
              :label="`${c.cname}（${c.cid}）`"
              :value="c.cid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学期" prop="term">
          <el-input v-model="scoreForm.term" :disabled="isEdit" placeholder="如 2026秋" />
        </el-form-item>
        <el-form-item label="平时分" prop="usual">
          <el-input-number v-model="scoreForm.usual" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="期末分" prop="finalScore">
          <el-input-number v-model="scoreForm.finalScore" :min="0" :max="100" />
        </el-form-item>
        <el-alert
          :title="`总分 = 平时分 × 0.4 + 期末分 × 0.6 = ${previewTotal}（由后端统一计算）`"
          type="info"
          :closable="false"
          show-icon
        />
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { queryStudents, saveScore, getCourseList } from '@/api/score'

const searchForm = reactive({ sid: '', name: '', className: '', cid: '' })
const studentList = ref([])
const courses = ref([])
const loading = ref(false)

const dialogVisible = ref(false)
const dialogTitle = ref('录入成绩')
const isEdit = ref(false)
const saving = ref(false)
const formRef = ref(null)

const emptyScoreForm = () => ({ sid: '', cid: '', term: '2026秋', usual: 60, finalScore: 60 })
const scoreForm = reactive(emptyScoreForm())

const rules = {
  sid: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  cid: [{ required: true, message: '请选择课程', trigger: 'change' }],
  term: [{ required: true, message: '请输入学期', trigger: 'blur' }],
  usual: [{ required: true, message: '请输入平时分', trigger: 'blur' }],
  finalScore: [{ required: true, message: '请输入期末分', trigger: 'blur' }]
}

const previewTotal = computed(() => {
  const u = Number(scoreForm.usual) || 0
  const f = Number(scoreForm.finalScore) || 0
  return Math.round(u * 0.4 + f * 0.6)
})

/**
 * 没有成绩时补一行「无」，
 * 满足需求：无成绩的学员也要能看到本人信息，而不是一片空白。
 */
const displayScores = (scores) => {
  if (scores && scores.length > 0) return scores
  return [
    { _empty: true, cname: '无', cid: '无', term: '无', usual: '无', finalScore: '无', total: '无' }
  ]
}

const loadCourses = async () => {
  try {
    const res = await getCourseList()
    if (res.code === 200) courses.value = res.data || []
  } catch (e) {
    console.error('课程列表加载失败', e)
  }
}

const handleSearch = async () => {
  loading.value = true
  try {
    const res = await queryStudents({
      sid: searchForm.sid || undefined,
      name: searchForm.name || undefined,
      className: searchForm.className || undefined,
      cid: searchForm.cid || undefined
    })
    if (res.code === 200) {
      studentList.value = res.data || []
      if (studentList.value.length === 0) {
        if (searchForm.sid) {
          // 需求：查询不存在的学员要给明确弹窗
          ElMessageBox.alert('不存在该学员', '提示', {
            type: 'warning',
            confirmButtonText: '知道了'
          })
        } else {
          ElMessage.warning('未查询到符合条件的学生')
        }
      }
    } else {
      ElMessage.error(res.message || '查询失败')
    }
  } catch (error) {
    const data = error.response && error.response.data
    ElMessage.error((data && data.message) || '查询失败')
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  Object.assign(searchForm, { sid: '', name: '', className: '', cid: '' })
  studentList.value = []
}

const openAddDialog = (student) => {
  isEdit.value = false
  dialogTitle.value = student
    ? `为 ${student.sname}（${student.sid}）录入成绩`
    : '录入成绩'
  Object.assign(scoreForm, emptyScoreForm())
  if (student) scoreForm.sid = student.sid
  dialogVisible.value = true
}

const openEditDialog = (student, row) => {
  isEdit.value = true
  dialogTitle.value = `修改成绩：${student.sname}（${student.sid}）`
  Object.assign(scoreForm, {
    sid: row.sid,
    cid: row.cid,
    term: row.term,
    usual: row.usual,
    finalScore: row.finalScore
  })
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch (e) {
    return
  }
  saving.value = true
  try {
    const res = await saveScore({ ...scoreForm })
    if (res.code === 200) {
      ElMessage.success(res.data || '保存成功')
      dialogVisible.value = false
      await handleSearch()
    } else {
      ElMessage.error(res.message || '保存失败')
    }
  } catch (error) {
    const data = error.response && error.response.data
    ElMessage.error((data && data.message) || '保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadCourses()
  handleSearch()
})
</script>

<style scoped>
.result-area {
  margin-top: 16px;
  min-height: 120px;
}

.student-card {
  margin-bottom: 16px;
}

.student-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.student-name {
  font-size: 15px;
  font-weight: 600;
  color: #1f2d3d;
}

.student-head-right {
  margin-left: auto;
}

.no-score-tip {
  margin-top: 10px;
  font-size: 12px;
  color: #e6a23c;
}
</style>
