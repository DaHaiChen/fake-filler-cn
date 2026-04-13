import { createRouter, createWebHashHistory } from 'vue-router'

/**
 * 使用 Hash 模式，保证从 `/playground.html` 直接打开时路由可用（无需服务端 rewrite）。
 */
export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('./pages/Home.vue'),
        },
        {
            path: '/element-plus',
            name: 'element-plus',
            component: () => import('./pages/ElementPlusForm.vue'),
        },
        {
            path: '/antd',
            name: 'antd',
            component: () => import('./pages/AntDesignForm.vue'),
        },
    ],
})
