<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div class="card-head">
          <span>成绩分布</span>
          <span class="card-sub">按总分分数段统计人数</span>
        </div>
      </template>
      <div ref="chartRef" style="height: 320px;"></div>
    </el-card>

    <el-card shadow="never" class="class-card">
      <template #header>
        <div class="card-head">
          <span>班级平均分 / 及格率</span>
          <span class="card-sub">按班级聚合</span>
        </div>
      </template>
      <el-table :data="classData" style="width: 100%">
        <el-table-column prop="className" label="班级" min-width="140" />
        <el-table-column prop="avgScore" label="平均分" width="120" />
        <el-table-column prop="passCount" label="及格人数" width="120" />
        <el-table-column prop="totalCount" label="总人数" width="120" />
        <el-table-column prop="passRate" label="及格率" width="120" />
      </el-table>
      <el-empty v-if="classData.length === 0" description="暂无统计数据" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { getScoreDistribution, getClassAverage } from '@/api/statistics'

const chartRef = ref(null)
const classData = ref([])
let chart = null

const loadDistribution = async () => {
  const res = await getScoreDistribution()
  if (res.code !== 200) {
    ElMessage.error(res.message || '成绩分布加载失败')
    return
  }
  const data = res.data || {}
  chart = echarts.init(chartRef.value)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 20, top: 30, bottom: 40 },
    xAxis: { type: 'category', data: Object.keys(data) },
    yAxis: { type: 'value', name: '人数' },
    series: [
      {
        type: 'bar',
        data: Object.values(data),
        barWidth: '45%',
        itemStyle: { color: '#409EFF' },
        label: { show: true, position: 'top' }
      }
    ]
  })
}

const loadClassAverage = async () => {
  const res = await getClassAverage()
  if (res.code === 200) {
    classData.value = res.data || []
  }
}

const handleResize = () => {
  if (chart) chart.resize()
}

onMounted(async () => {
  try {
    await Promise.all([loadDistribution(), loadClassAverage()])
  } catch (e) {
    console.error('加载统计失败', e)
    ElMessage.error('统计数据加载失败')
  }
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chart) {
    chart.dispose()
    chart = null
  }
})
</script>

<style scoped>
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

.class-card {
  margin-top: 16px;
}
</style>
