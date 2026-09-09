import axios from 'axios'

const request = axios.create({
    baseURL: '/api',        // 代理到后端
    timeout: 10000
})

// 请求拦截器：自动携带 token
request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => Promise.reject(error)
)

// 响应拦截器：统一处理 401
request.interceptors.response.use(
    response => response.data,
    error => {
        if (error.response && error.response.status === 401) {
            // token 过期或无效，跳转到登录页
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default request