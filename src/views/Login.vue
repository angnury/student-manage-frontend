<template>
  <div class="login-page">
    <div class="login-brand">
      <h1>学生综合信息管理系统</h1>
      <p>Student Information Management System</p>
      <ul>
        <li>学籍管理 · 成绩录入 · 统计分析</li>
        <li>Spring Boot 3 + MyBatis-Plus + MySQL + Vue 3</li>
        <li>三种角色：管理员 / 教师 / 学生</li>
      </ul>
    </div>

    <el-card class="login-card" shadow="always">
      <h2 class="login-title">账号登录</h2>
      <el-form :model="form" label-width="72px" @submit.prevent>
        <el-form-item label="用户名">
          <el-input
            v-model="form.username"
            placeholder="学号 / 教师号 / admin"
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" style="width:100%" @click="handleLogin">
            登 录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-tip">
        学生用学号登录 · 教师用工号登录 · 管理员用 admin 登录<br />
        初始密码均为 123456，首次登录后请及时修改
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/auth'
import { useUserStore } from '@/store/user'
import { homeFor } from '@/utils/roles'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

// 不再预填管理员账号密码，避免把真实账号写死在页面上
const form = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  loading.value = true
  try {
    const res = await login(form.username.trim(), form.password)
    if (res.code === 200) {
      const { token, username, role } = res.data
      userStore.setUserInfo(token, username, role)
      ElMessage.success('登录成功')
      // 按角色跳转：管理员 -> 工作台，教师 -> 成绩管理，学生 -> 我的信息
      router.push(homeFor(role))
    } else {
      ElMessage.error(res.message || '登录失败')
    }
  } catch (error) {
    const data = error.response && error.response.data
    ElMessage.error((data && data.message) || '网络错误，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;
  min-height: 100vh;
  padding: 40px;
  background: linear-gradient(135deg, #1b3f7a 0%, #2f6fd0 50%, #4a9ae8 100%);
}

.login-brand {
  max-width: 420px;
  color: #ffffff;
}

.login-brand h1 {
  margin: 0 0 12px;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: 1px;
  /* 显式指定颜色，避免继承全局变量导致标题发灰看不清 */
  color: #ffffff;
}

.login-brand p {
  margin: 0 0 24px;
  font-size: 14px;
  letter-spacing: 2px;
  opacity: 0.85;
}

.login-brand ul {
  margin: 0;
  padding-left: 18px;
  font-size: 14px;
  line-height: 2;
  opacity: 0.9;
}

.login-card {
  width: 400px;
  border: none;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
}

.login-title {
  margin: 0 0 24px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #1f2d3d;
}

.login-tip {
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.8;
  color: #909399;
  text-align: center;
}

@media (max-width: 900px) {
  .login-page {
    flex-direction: column;
    gap: 32px;
  }
  .login-brand {
    text-align: center;
  }
}
</style>
