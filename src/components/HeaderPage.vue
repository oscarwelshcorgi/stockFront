<template>
  <header>
    <div id="nav">
      <router-link to="/">메인</router-link> |
      <router-link to="/board/BoardList">게시판</router-link>

<div id="app">
    <div v-if="!memberInfo">
        <button @click="redirectToGoogleAuth">구글 로그인123</button>
    </div>
    <div v-else>
        <h1>회원 정보</h1>
        <img :src="memberInfo.picture" />
        <p>Email : {{ memberInfo.email }}</p>
        <p>nickName: {{ memberInfo.nickName }}</p>
        <button @click="redirectToGoogleLogout">구글 로그아웃</button>
    </div>
</div>

    </div>
  </header>
  <hr/>
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