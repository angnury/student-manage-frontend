import request from '@/utils/request'

// 查询某个学生的成绩
export function getStudentScores(sid) {
    return request({
        url: `/teacher/students/${sid}/scores`,
        method: 'get'
    })
}

// 录入/更新成绩
export function saveScore(data) {
    return request({
        url: '/teacher/scores',
        method: 'post',
        data
    })
}