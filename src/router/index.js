import { createRouter, createWebHistory } from 'vue-router'
import MainPage from "@/views/MainPage.vue"
import BoardList from "@/views/board/BoardList.vue"
import BoardDetail from "@/views/board/BoardDetail.vue"
import BoardWrite from "@/views/board/BoardWrite.vue"

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
  },
  {
    path: '/board/BoardDetail',
    name: 'BoardDetail',
    component: BoardDetail
  },
  {
    path: '/board/BoardWrite',
    name: 'BoardWrite',
    component: BoardWrite
  },
]

const router = createRouter({
    history : createWebHistory(),
    routes
});

export default router