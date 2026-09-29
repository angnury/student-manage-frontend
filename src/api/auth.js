import request from '@/utils/request'

export function login(username, password) {
    return request({
        url: '/auth/login',
        method: 'post',
        data: { username, password }   // 后端已改为 @RequestBody LoginDTO
    })
}

export function getUserInfo() {
    return request({
        url: '/user/me',
        method: 'get'
    })
}
