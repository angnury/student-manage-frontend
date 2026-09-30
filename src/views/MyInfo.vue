<template>
  <div>
    <el-card shadow="never" v-loading="loading">
      <template #header>
        <div class="card-head">
          <span>我的个人信息</span>
          <el-tag type="success" size="small">学生</el-tag>
        </div>
      </template>

      <el-descriptions :column="3" border>
        <el-descriptions-item label="学号">{{ info.sid || '-' }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ info.sname || '-' }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ info.sex || '-' }}</el-descriptions-item>
        <el-descriptions-item label="班级">{{ info.sclass || '-' }}</el-descriptions-item>
        <el-descriptions-item label="出生日期">{{ info.birthday || '-' }}</el-descriptions-item>
        <el-descriptions-item label="籍贯">{{ info.jg || '-' }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ info.phone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="入学时间">{{ info.enterTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="登录账号">{{ userStore.username }}</el-descriptions-item>
      </el-descriptions>

      <el-alert
        class="info-tip"
        type="info"
        :closable="false"
        show-icon
        title="学籍信息由教务管理员维护，如发现信息有误请联系班主任或管理员修改。"
      />
    </el-card>

    <el-card shadow="never" class="quick-card">
      <template #header><span>快捷入口</span></template>
      <el-button type="primary" :icon="Tickets" @click="$router.push('/my-scores')">查看我的全部成绩</el-button>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Tickets } from '@element-plus/icons-vue'
import { getMyInfo } from '@/api/me'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const info = ref({})
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const res = await getMyInfo()
    if (res.code === 200) {
      info.value = res.data || {}
    } else {
      ElMessage.warning(res.message || '未获取到个人信息')
    }
  } catch (e) {
    const data = e.response && e.response.data
    ElMessage.error((data && data.message) || '个人信息加载失败')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-tip {
  margin-top: 16px;
}

.quick-card {
  margin-top: 16px;
}
</style>
