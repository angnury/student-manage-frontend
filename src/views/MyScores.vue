<template>
  <div>
    <el-row :gutter="16" class="summary-row">
      <el-col :xs="12" :sm="6" v-for="s in summary" :key="s.label">
        <el-card shadow="never" class="summary-card">
          <div class="summary-value" :style="{ color: s.color }">{{ s.value }}</div>
          <div class="summary-label">{{ s.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" v-loading="loading">
      <template #header>
        <div class="card-head">
          <span>我的成绩</span>
          <span class="card-sub">共 {{ scoreList.length }} 条记录</span>
        </div>
      </template>

      <el-table :data="scoreList" style="width: 100%">
        <el-table-column prop="cname" label="课程" min-width="140" />
        <el-table-column prop="cid" label="课程编号" width="110" />
        <el-table-column prop="term" label="学期" width="110" />
        <el-table-column prop="usual" label="平时分" width="90" />
        <el-table-column prop="finalScore" label="期末分" width="90" />
        <el-table-column prop="total" label="总分" width="90">
          <template #default="{ row }">
            <el-tag :type="row.total >= 60 ? 'success' : 'danger'" size="small">
              {{ row.total }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否及格" width="100">
          <template #default="{ row }">
            <span :class="row.total >= 60 ? 'pass' : 'fail'">
              {{ row.total >= 60 ? '及格' : '不及格' }}
            </span>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="!loading && scoreList.length === 0" description="暂无成绩记录" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMyScores } from '@/api/me'

const scoreList = ref([])
const loading = ref(false)

const summary = computed(() => {
  const totals = scoreList.value.map((s) => Number(s.total)).filter((n) => !Number.isNaN(n))
  if (totals.length === 0) {
    return [
      { label: '已出成绩门数', value: 0, color: '#2f6fd0' },
      { label: '平均分', value: '-', color: '#13a8a8' },
      { label: '最高分', value: '-', color: '#67c23a' },
      { label: '不及格门数', value: 0, color: '#f56c6c' }
    ]
  }
  const sum = totals.reduce((a, b) => a + b, 0)
  return [
    { label: '已出成绩门数', value: totals.length, color: '#2f6fd0' },
    { label: '平均分', value: (sum / totals.length).toFixed(1), color: '#13a8a8' },
    { label: '最高分', value: Math.max(...totals), color: '#67c23a' },
    { label: '不及格门数', value: totals.filter((n) => n < 60).length, color: '#f56c6c' }
  ]
})

onMounted(async () => {
  loading.value = true
  try {
    const res = await getMyScores()
    if (res.code === 200) {
      scoreList.value = res.data || []
    } else {
      ElMessage.warning(res.message || '未获取到成绩')
    }
  } catch (e) {
    const data = e.response && e.response.data
    ElMessage.error((data && data.message) || '成绩加载失败')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.summary-row {
  margin-bottom: 16px;
}

.summary-card {
  text-align: center;
}

.summary-value {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
}

.summary-label {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
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

.pass {
  color: #67c23a;
}

.fail {
  color: #f56c6c;
}
</style>
