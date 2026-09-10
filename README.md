# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).


---

## 三、Vue3 前端（student-manage-frontend）

```markdown
# 学生综合信息管理系统 · Web 前端（Vue3 + Element Plus）

> 前后端分离 · 管理后台 · 角色动态菜单

## 项目简介

基于 Vue3 + Vite + Element Plus 开发的管理后台，通过 Axios 调用后端 RESTful 接口，实现登录、学生管理、成绩管理、统计报表等功能。使用 Vue Router 做路由守卫，Pinia 管理用户状态，Axios 拦截器自动携带 JWT Token。

## 技术栈

- Vue3（Composition API）
- Vite
- Element Plus
- Vue Router
- Pinia
- Axios
- ECharts

## 功能页面

- 登录页（JWT 登录）
- 布局页（侧边菜单根据角色动态显示）
- 学生管理（分页、搜索、新增、编辑、删除）
- 成绩管理（查询、录入、修改）
- 统计报表（成绩分布柱状图、班级平均分表格）

## 如何运行

1. 确保已安装 Node.js 18+
2. 安装依赖：
   ```bash
   npm install