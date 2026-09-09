import request from '@/utils/request'

export function login(username, password) {
    return request({
        url: '/auth/login',
        method: 'post',
        params: { username, password }   // 因为后端用的是 @RequestParam
    })
}

export function getUserInfo() {
    return request({
        url: '/user/me',
        method: 'get'
    })
}