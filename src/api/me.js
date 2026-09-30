import request from '@/utils/request'

/** 学生：我的个人信息（学号取自后端登录态，无需传参） */
export function getMyInfo() {
    return request({
        url: '/student/my/info',
        method: 'get'
    })
}

/** 学生：我的全部成绩 */
export function getMyScores() {
    return request({
        url: '/student/my/scores',
        method: 'get'
    })
}
