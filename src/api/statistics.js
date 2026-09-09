import request from '@/utils/request'

export function getScoreDistribution() {
    return request({
        url: '/admin/statistics/score-distribution',
        method: 'get'
    })
}

export function getClassAverage() {
    return request({
        url: '/admin/statistics/class-average',
        method: 'get'
    })
}