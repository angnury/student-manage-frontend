<template>
  <el-container class="layout">
    <el-aside width="220px" class="layout-aside">
      <div class="brand">
        <div class="brand-mark">学</div>
        <div>
          <div class="brand-title">学生综合信息管理系统</div>
          <div class="brand-sub">Student Info Management</div>
        </div>
      </div>

      <el-menu :default-active="activeMenu" router class="layout-menu">
        <el-menu-item index="/dashboard" v-if="isAdmin">
          <el-icon><HomeFilled /></el-icon><span>工作台</span>
        </el-menu-item>
        <el-menu-item index="/students" v-if="isAdmin">
          <el-icon><User /></el-icon><span>学生管理</span>
        </el-menu-item>
        <el-menu-item index="/scores" v-if="canScore">
          <el-icon><Document /></el-icon><span>成绩管理</span>
        </el-menu-item>
        <el-menu-item index="/statistics" v-if="isAdmin">
          <el-icon><DataLine /></el-icon><span>统计报表</span>
        </el-menu-item>
        <el-menu-item index="/my-info" v-if="isStudent">
          <el-icon><Postcard /></el-icon><span>我的信息</span>
        </el-menu-item>
        <el-menu-item index="/my-scores" v-if="isStudent">
          <el-icon><Tickets /></el-icon><span>我的成绩</span>
        </el-menu-item>
      </el-menu>

      <div class="aside-footer">
        <div class="aside-role">{{ roleLabel(userStore.role) }}</div>
        <div class="aside-account">{{ userStore.username }}</div>
      </div>
    </el-aside>

    <el-container>
      <el-header class="layout-header">
        <div class="header-title">{{ pageTitle }}</div>
        <div class="header-right">
          <el-tag :type="roleTagType" size="small" effect="dark">{{ roleLabel(userStore.role) }}</el-tag>
          <span class="header-user">欢迎，{{ userStore.username }}</span>
          <el-button type="danger" size="small" plain @click="logout">退出登录</el-button>
        </div>
      </el-header>

      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { roleLabel } from '@/utils/roles'
import { HomeFilled, User, Document, DataLine, Postcard, Tickets } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isAdmin = computed(() => userStore.role === 'ADMIN')
const isStudent = computed(() => userStore.role === 'STUDENT')
const canScore = computed(() => userStore.role === 'TEACHER' || userStore.role === 'ADMIN')

const activeMenu = computed(() => route.path)

const PAGE_TITLES = {
  '/dashboard': '工作台',
  '/students': '学生管理',
  '/scores': '成绩管理',
  '/statistics': '统计报表',
  '/my-info': '我的信息',
  '/my-scores': '我的成绩'
}
const pageTitle = computed(() => PAGE_TITLES[route.path] || '学生综合信息管理系统')

const roleTagType = computed(() => {
  if (userStore.role === 'ADMIN') return 'danger'
  if (userStore.role === 'TEACHER') return 'warning'
  return 'success'
})

const logout = () => {
  userStore.logout()
  ElMessage.success('已退出')
  router.push('/login')
}
</script>

<style scoped>
.layout {
  height: 100vh;
}

.layout-aside {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-right: 1px solid #e6e8eb;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 14px;
  border-bottom: 1px solid #f0f2f5;
}

.brand-mark {
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: linear-gradient(135deg, #2f6fd0, #4a9ae8);
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-title {
  font-size: 13px;
  font-weight: 600;
  color: #1f2d3d;
  line-height: 1.3;
}

.brand-sub {
  font-size: 10px;
  color: #a8abb2;
  letter-spacing: 0.4px;
}

.layout-menu {
  flex: 1;
  border-right: none;
  padding-top: 8px;
}

.aside-footer {
  padding: 14px;
  border-top: 1px solid #f0f2f5;
  background: #fafbfc;
}

.aside-role {
  font-size: 12px;
  color: #606266;
}

.aside-account {
  margin-top: 2px;
  font-size: 12px;
  color: #a8abb2;
  word-break: break-all;
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-bottom: 1px solid #e6e8eb;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.06);
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2d3d;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-user {
  font-size: 13px;
  color: #606266;
}

.layout-main {
  background: #f0f2f5;
  padding: 16px;
}
</style>
