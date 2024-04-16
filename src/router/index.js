import { createRouter, createWebHistory } from 'vue-router'
import MainPage from "@/views/MainPage.vue"
import BoardList from "@/views/board/BoardList.vue"

const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/board/BoardList',
    name: 'BoardList',
    component: BoardList
  }
]

const router = createRouter({
    history : createWebHistory(),
    routes
});

export default router