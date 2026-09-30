<template>
  <div>
    <el-card class="welcome-card" shadow="never">
      <div class="welcome-inner">
        <div>
          <h2 class="welcome-title">你好，{{ userStore.username }}</h2>
          <p class="welcome-desc">
            欢迎使用学生综合信息管理系统。当前角色为管理员，可进行学籍管理、成绩录入与统计分析。
          </p>
        </div>
        <div class="welcome-actions">
          <el-button type="primary" @click="$router.push('/students')">学生管理</el-button>
          <el-button @click="$router.push('/scores')">成绩录入</el-button>
          <el-button @click="$router.push('/statistics')">查看统计</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="16" class="stat-row">
      <el-col :xs="12" :sm="12" :md="6" v-for="card in cards" :key="card.label">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-inner">
            <div class="stat-icon" :style="{ background: card.color }">
              <el-icon :size="20"><component :is="card.icon" /></el-icon>
            </div>
            <div>
              <div class="stat-value">{{ card.value }}</div>
              <div class="stat-label">{{ card.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="tips-card">
      <template #header><span>使用指引</span></template>
      <ul class="tips">
        <li>
          <strong>学生管理</strong>：分页浏览学籍，支持按学号 / 姓名 / 班级模糊查询；
          新增学生时会自动创建登录账号（用户名 = 学号，默认密码 123456）。
        </li>
        <li>
          <strong>成绩管理</strong>：支持按学号 / 姓名 / 班级 / 课程查询，可录入或修改成绩；
          总分由后端按「平时分 × 0.4 + 期末分 × 0.6」自动计算，前端传入的分数会被忽略。
        </li>
        <li>
          <strong>统计报表</strong>：成绩分布柱状图，以及各班平均分与及格率。
        </li>
        <li>
          <strong>账号说明</strong>：学生用学号、教师用工号登录，只能查看本人数据；
          教学与管理接口按角色做了接口级权限控制。
        </li>
      </ul>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, markRaw } from 'vue'
import { User, School, Notebook, Tickets } from '@element-plus/icons-vue'
import { getOverview } from '@/api/statistics'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const overview = ref({ studentCount: '-', classCount: '-', courseCount: '-', scoreCount: '-' })

const cards = computed(() => [
  { label: '学生总数', value: overview.value.studentCount, color: '#2f6fd0', icon: markRaw(User) },
  { label: '班级数量', value: overview.value.classCount, color: '#13a8a8', icon: markRaw(School) },
  { label: '课程数量', value: overview.value.courseCount, color: '#e6a23c', icon: markRaw(Notebook) },
  { label: '成绩记录', value: overview.value.scoreCount, color: '#67c23a', icon: markRaw(Tickets) }
])

onMounted(async () => {
  try {
    const res = await getOverview()
    if (res.code === 200 && res.data) {
      overview.value = res.data
    }
  } catch (e) {
    console.error('概览数据加载失败', e)
  }
})
</script>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, #eef4ff 0%, #f7fbff 100%);
  border: 1px solid #dbe7fb;
}

.welcome-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.welcome-title {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 600;
  color: #1f2d3d;
}

.welcome-desc {
  margin: 0;
  font-size: 13px;
  color: #606266;
}

.welcome-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stat-row {
  margin-top: 16px;
}

.stat-card {
  margin-bottom: 16px;
}

.stat-inner {
  display: flex;
  align-items: center;
  gap: 14px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #1f2d3d;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.tips-card {
  margin-top: 8px;
}

.tips {
  margin: 0;
  padding-left: 18px;
  line-height: 2;
  font-size: 13px;
  color: #606266;
}
</style>
