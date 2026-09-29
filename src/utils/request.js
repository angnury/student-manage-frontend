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

// 响应拦截器：成功直接返回后端统一返回体 Result；失败统一处理登录态
request.interceptors.response.use(
    response => response.data,
    error => {
        const status = error.response && error.response.status
        const url = (error.config && error.config.url) || ''
        const isLoginRequest = url.indexOf('/auth/login') !== -1

        // 401 且不是登录接口本身 -> 登录态失效，清空本地信息并跳登录页。
        // 登录接口的 401 表示「用户名或密码错误」，要留给登录页自己提示，不能跳转。
        if (status === 401 && !isLoginRequest) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default request
