import { createRouter, createWebHistory } from 'vue-router'
import { homeFor } from '@/utils/roles'

import Login from '@/views/Login.vue'
import Layout from '@/components/Layout.vue'
import Dashboard from '@/views/Dashboard.vue'
import StudentManage from '@/views/StudentManage.vue'
import ScoreManage from '@/views/ScoreManage.vue'
import Statistics from '@/views/Statistics.vue'
import MyInfo from '@/views/MyInfo.vue'
import MyScores from '@/views/MyScores.vue'

const routes = [
    { path: '/login', component: Login },
    {
        path: '/',
        component: Layout,
        children: [
            { path: 'dashboard', component: Dashboard, meta: { roles: ['ADMIN'] } },
            { path: 'students', component: StudentManage, meta: { roles: ['ADMIN'] } },
            { path: 'scores', component: ScoreManage, meta: { roles: ['TEACHER', 'ADMIN'] } },
            { path: 'statistics', component: Statistics, meta: { roles: ['ADMIN'] } },
            { path: 'my-info', component: MyInfo, meta: { roles: ['STUDENT'] } },
            { path: 'my-scores', component: MyScores, meta: { roles: ['STUDENT'] } }
        ]
    },
    // 兜底：未知路径回根路径，再由守卫分流
    { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

/**
 * 全局守卫，解决三个问题：
 * 1. 未登录访问任何页面都回登录页（此前访问 / 会因为父路由没有默认子路由而渲染出空白页）；
 * 2. 已登录再访问 /login 直接送回自己的首页；
 * 3. 按 meta.roles 做路由级权限校验，防止学生/教师手输 URL 进入管理员页面。
 *    （此前 meta.roles 只是写了但从未被校验，菜单靠 v-if 隐藏，直接输 URL 就能绕过。）
 */
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role') || ''

    if (to.path === '/login') {
        return token ? next(homeFor(role)) : next()
    }

    if (!token) {
        return next('/login')
    }

    // 根路径按角色分流，避免出现空白页
    if (to.path === '/') {
        return next(homeFor(role))
    }

    const allowedRoles = to.matched.reduce(
        (acc, record) => acc.concat((record.meta && record.meta.roles) || []),
        []
    )
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return next(homeFor(role))
    }

    next()
})

export default router
