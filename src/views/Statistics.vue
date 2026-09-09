<template>
  <div>
    <el-card>
      <h3>成绩分布</h3>
      <div id="distributionChart" style="height: 300px;"></div>
    </el-card>
    <el-card style="margin-top: 20px;">
      <h3>班级平均分 / 及格率</h3>
      <el-table :data="classData" style="width:100%">
        <el-table-column prop="班级" label="班级" />
        <el-table-column prop="平均分" label="平均分" />
        <el-table-column prop="及格人数" label="及格人数" />
        <el-table-column prop="总人数" label="总人数" />
        <el-table-column prop="及格率" label="及格率" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getScoreDistribution, getClassAverage } from '@/api/statistics'

const classData = ref([])

const loadDistribution = async () => {
  try {
    const res = await getScoreDistribution()
    if (res.code === 200) {
      const data = res.data
      // 简单展示：用 alert 模拟，实际可以用 echarts
      console.log('成绩分布:', data)
    }
  } catch (error) {
    console.error('加载统计失败', error)
  }
}

const loadClassAverage = async () => {
  try {
    const res = await getClassAverage()
    if (res.code === 200) {
      classData.value = res.data
    }
  } catch (error) {
    console.error('加载班级统计失败', error)
  }
}

onMounted(() => {
  loadDistribution()
  loadClassAverage()
})
</script>