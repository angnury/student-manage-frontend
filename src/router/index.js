import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Layout from '@/components/Layout.vue'
import StudentManage from '@/views/StudentManage.vue'
import ScoreManage from '@/views/ScoreManage.vue'
import Statistics from '@/views/Statistics.vue'

const routes = [
    { path: '/login', component: Login },
    {
        path: '/',
        component: Layout,
        children: [
            { path: 'students', component: StudentManage, meta: { roles: ['ADMIN'] } },
            { path: 'scores', component: ScoreManage, meta: { roles: ['TEACHER', 'ADMIN'] } },
            { path: 'statistics', component: Statistics, meta: { roles: ['ADMIN'] } }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    if (to.path !== '/login' && !token) {
        next('/login')
    } else {
        next()
    }
})

export default router