<template>
  <el-container style="height: 100vh;">
    <el-aside width="200px">
      <el-menu :default-active="$route.path" router>
        <el-menu-item index="/students" v-if="userStore.role === 'ADMIN'">
          <el-icon><User /></el-icon>学生管理
        </el-menu-item>
        <el-menu-item index="/scores" v-if="userStore.role === 'TEACHER' || userStore.role === 'ADMIN'">
          <el-icon><Document /></el-icon>成绩管理
        </el-menu-item>
        <el-menu-item index="/statistics" v-if="userStore.role === 'ADMIN'">
          <el-icon><DataLine /></el-icon>统计报表
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="background:#fff; border-bottom:1px solid #ddd; display:flex; justify-content:space-between; align-items:center;">
        <span>欢迎 {{ userStore.username }}</span>
        <el-button type="danger" size="small" @click="logout">退出</el-button>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Document, DataLine } from '@element-plus/icons-vue'

const userStore = useUserStore()
const router = useRouter()

const logout = () => {
  userStore.logout()
  ElMessage.success('已退出')
  router.push('/login')
}
</script>