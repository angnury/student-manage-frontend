import request from '@/utils/request'

/** 管理员：工作台概览计数 */
export function getOverview() {
    return request({
        url: '/admin/statistics/overview',
        method: 'get'
    })
}

/** 管理员：成绩分布 */
export function getScoreDistribution() {
    return request({
        url: '/admin/statistics/score-distribution',
        method: 'get'
    })
}

/** 管理员：班级平均分 / 及格率 */
export function getClassAverage() {
    return request({
        url: '/admin/statistics/class-average',
        method: 'get'
    })
}
