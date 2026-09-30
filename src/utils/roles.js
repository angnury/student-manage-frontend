/**
 * 角色相关常量与工具。
 * 集中一处，避免 router / Login / Layout 各写一份导致不一致。
 */

/** 角色 -> 中文名 */
export const ROLE_LABEL = {
    ADMIN: '管理员',
    TEACHER: '教师',
    STUDENT: '学生'
}

/** 角色 -> 登录后的默认首页 */
export const HOME_BY_ROLE = {
    ADMIN: '/dashboard',
    TEACHER: '/scores',
    STUDENT: '/my-info'
}

/** 根据角色取首页，未知角色回登录页 */
export function homeFor(role) {
    return HOME_BY_ROLE[role] || '/login'
}

export function roleLabel(role) {
    return ROLE_LABEL[role] || role || '未知'
}
