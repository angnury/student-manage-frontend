<template>
  <div>
    <el-card>
      <h3>成绩分布</h3>
      <div ref="chartRef" style="height: 320px;"></div>
    </el-card>

    <el-card style="margin-top: 20px;">
      <h3>班级平均分 / 及格率</h3>
      <el-table :data="classData" style="width:100%">
        <el-table-column prop="className" label="班级" />
        <el-table-column prop="avgScore" label="平均分" />
        <el-table-column prop="passCount" label="及格人数" />
        <el-table-column prop="totalCount" label="总人数" />
        <el-table-column prop="passRate" label="及格率" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { getScoreDistribution, getClassAverage } from '@/api/statistics'

const chartRef = ref(null)
const classData = ref([])
let chart = null

const loadDistribution = async () => {
  const res = await getScoreDistribution()
  if (res.code !== 200) return
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
