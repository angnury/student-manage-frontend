import request from '@/utils/request'

/** 教师 / 管理员：按条件查询学生及其成绩（支持学号、姓名、班级、课程） */
export function queryStudents(params) {
    return request({
        url: '/teacher/students',
        method: 'get',
        params
    })
}

/** 教师 / 管理员：查询单个学生成绩（学员不存在时后端返回业务码 404） */
export function getStudentScores(sid) {
    return request({
        url: `/teacher/students/${sid}/scores`,
        method: 'get'
    })
}

/** 教师 / 管理员：课程列表，录入成绩时下拉选择 */
export function getCourseList() {
    return request({
        url: '/teacher/courses',
        method: 'get'
    })
}

/** 教师 / 管理员：录入或更新成绩 */
export function saveScore(data) {
    return request({
        url: '/teacher/scores',
        method: 'post',
        data
    })
}
