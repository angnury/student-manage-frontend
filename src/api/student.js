import request from '@/utils/request'

export function getStudentList(params) {
    return request({
        url: '/admin/students',
        method: 'get',
        params   // page, size, sid, name, className
    })
}

// 新增学生（后续可加）
export function addStudent(data) {
    return request({
        url: '/admin/students',
        method: 'post',
        data
    })
}

// 更新学生
export function updateStudent(sid, data) {
    return request({
        url: `/admin/students/${sid}`,
        method: 'put',
        data
    })
}

// 删除学生
export function deleteStudent(sid) {
    return request({
        url: `/admin/students/${sid}`,
        method: 'delete'
    })
}