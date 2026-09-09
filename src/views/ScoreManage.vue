<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item label="学号">
          <el-input v-model="searchSid" placeholder="输入学号查询成绩" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchScores">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px;">
      <el-table :data="scoreList" style="width: 100%">
        <el-table-column prop="sid" label="学号" />
        <el-table-column prop="cid" label="课程编号" />
        <el-table-column prop="term" label="学期" />
        <el-table-column prop="usual" label="平时分" />
        <el-table-column prop="finalScore" label="期末分" />
        <el-table-column prop="total" label="总分" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="text" @click="openEditDialog(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 录入/编辑成绩弹窗 -->
    <el-dialog v-model="dialogVisible" title="录入/编辑成绩" width="400px">
      <el-form :model="scoreForm" label-width="100px">
        <el-form-item label="学号">
          <el-input v-model="scoreForm.sid" disabled />
        </el-form-item>
        <el-form-item label="课程编号">
          <el-input v-model="scoreForm.cid" disabled />
        </el-form-item>
        <el-form-item label="学期">
          <el-input v-model="scoreForm.term" disabled />
        </el-form-item>
        <el-form-item label="平时分">
          <el-input-number v-model="scoreForm.usual" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="期末分">
          <el-input-number v-model="scoreForm.finalScore" :min="0" :max="100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getStudentScores, saveScore as saveScoreApi } from '@/api/score'

const searchSid = ref('')
const scoreList = ref([])
const dialogVisible = ref(false)
const scoreForm = reactive({ sid: '', cid: '', term: '', usual: 0, finalScore: 0 })

const fetchScores = async () => {
  if (!searchSid.value) {
    ElMessage.warning('请输入学号')
    return
  }
  try {
    const res = await getStudentScores(searchSid.value)
    if (res.code === 200) {
      scoreList.value = res.data
    }
  } catch (error) {
    ElMessage.error('查询失败')
  }
}

const openEditDialog = (row) => {
  Object.assign(scoreForm, row)
  dialogVisible.value = true
}

const handleSave = async () => {
  try {
    const res = await saveScoreApi(scoreForm)
    if (res.code === 200) {
      ElMessage.success(res.data)
      dialogVisible.value = false
      fetchScores()
    }
  } catch (error) {
    ElMessage.error('保存失败')
  }
}
</script>