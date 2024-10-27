import { createRouter, createWebHistory } from 'vue-router';
import MainPage from "@/views/MainPage.vue";
import BoardList from "@/views/board/BoardList.vue";
import BoardDetail from "@/views/board/BoardDetail.vue";
import BoardWrite from "@/views/board/BoardWrite.vue";
import NickNameSetup from "@/views/etc/NickNameSetup.vue";

const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage,
  },
  {
    path: '/board/BoardList',
    name: 'BoardList',
    component: BoardList,
  },
  {
    path: '/board/BoardDetail',
    name: 'BoardDetail',
    component: BoardDetail,
  },
  {
    path: '/board/BoardWrite',
    name: 'BoardWrite',
    component: BoardWrite,
  },
  {
    path: '/etc/NickNameSetup',
    name: 'NickNameSetup',
    component: NickNameSetup,
  }
]

const router = createRouter({
    history : createWebHistory(),
    routes,
    mode:'history',
});

// 라우트 변경 시 페이지 제목 설정
router.beforeEach((to, from, next) => {
  // 기본 제목을 설정하되, 게시글 상세 페이지에서는 제목 설정을 하지 않음
  if (to.name !== 'BoardDetail') {
    document.title = to.meta.title || '바이너리스톡 - 유머, 게임, 축구, 이슈, 뉴스';
  }
  next();
});

router.beforeEach((to, from, next) => {
  if (to.path === '/ads.txt' || to.path === '/sitemap.xml' || to.path === '/robots.txt') {
    // '/ads.txt', '/sitemap.xml', '/robots.txt' 경로일 경우 처리하지 않음
    return next(false);
  }
  // 다른 모든 경우에는 다음 단계로 진행
  next();
});

export default router