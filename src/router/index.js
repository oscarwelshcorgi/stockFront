import { createRouter, createWebHistory } from 'vue-router'
import VueTest from "@/views/board/VueTest"

const routes = [
  {
    path: '/board/VueTest',
    name: 'VueTest',
    component: VueTest
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router