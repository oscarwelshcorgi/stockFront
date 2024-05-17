<template>
  <div class="container">
    <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div class="logo-container">
        <router-link to="/">
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fl5Ocm%2Fbtrz0uMdgTY%2FKF29pRts2VFHtN4NocXZK0%2Fimg.png" alt="logo" width="50" height="50">
        </router-link>
      </div>

      <ul class="nav nav-pills">
        <li class="nav-item"><router-link to="/" class="nav-link" aria-current="page">메인</router-link></li>
        <li class="nav-item"><router-link to="/board/BoardList" class="nav-link">게시판</router-link></li>
        <li class="nav-item"><a href="#" class="nav-link">공지사항</a></li>
        <li class="nav-item"><a href="#" class="nav-link">고객센터</a></li>
      </ul>

      <div class="col-md-3 text-end">
        <div v-if="!memberInfo">
          <button class="btn btn-outline-primary me-2" @click="redirectToGoogleAuth">구글 로그인</button>
        </div>
        <div v-else class="dropdown text-end">
          <a href="#" class="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
            <img :src="memberInfo.picture" alt="mdo" width="40" height="40" class="rounded-circle">
          </a>
          <ul class="dropdown-menu text-small" aria-labelledby="dropdownUser1" style="">
            <li><a class="dropdown-item" href="#">Email : {{ memberInfo.email }}</a></li>
            <li><a class="dropdown-item" href="#">nickName: {{ memberInfo.nickName }}s</a></li>
            <li><a class="dropdown-item" href="#">내정보</a></li>
            <li><a class="dropdown-item" @click="redirectToGoogleLogout">로그아웃</a></li>
          </ul>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import { convertKeysToCamelCase } from '@/vuex/convertToCamel';

export default {
  data() {
    return {
      memberInfo: null
    };
  },
  mounted() {
    // 세션 정보를 가져오는 API 엔드포인트 설정
    const apiUrl = 'http://localhost:8080/api/memberInfo';

    // Axios를 사용하여 세션 정보 요청
    this.$axios.get(apiUrl, { withCredentials: true }) // withCredentials 옵션을 통해 쿠키를 전달
      .then(response => {
        // 성공적으로 데이터를 받아왔을 때 처리
        const transformedData = convertKeysToCamelCase(response.data);
        this.memberInfo = transformedData;
        console.log(transformedData);
      })
      .catch(error => {
        // 에러 발생 시 처리
        console.error('Failed to fetch member info:', error);
      });
  },
  methods: {
    redirectToGoogleAuth() {
      window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    },
    redirectToGoogleLogout() {
      window.location.href = 'http://localhost:8080/logout';
    },
  }
};
</script>

<style>
/* 메뉴 클릭 시 해당 메뉴 색상 변경 */
.nav-link.router-link-exact-active {
  color: #fff; /* 활성 메뉴 항목 텍스트 색상 */
  background-color: #007bff; /* 활성 메뉴 항목 배경 색상 */
}
</style>