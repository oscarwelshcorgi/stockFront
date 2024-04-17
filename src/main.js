import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router';

const app = createApp(App)
app.config.globalProperties.$axios = axios;  //전역변수로 설정 컴포넌트에서 this.$axios 호출할 수 있음
app.config.globalProperties.$serverUrl = '//localhost:8080' //api server
app.use(router);
app.mount('#app')
// Axios 응답 인터셉터 설정
axios.interceptors.response.use(response => {
  if (response.data) {
    // 데이터가 존재하고 객체일 때만 변환 수행
    if (typeof response.data === 'object') {
      response.data = convertKeysToCamelCase(response.data);
    }
  }
  return response;
});

// snake_case를 camelCase로 변환하는 함수
function convertKeysToCamelCase(data) {
  if (Array.isArray(data)) {
    return data.map(item => convertKeysToCamelCase(item));
  } else if (data !== null && typeof data === 'object') {
    const camelCaseData = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const camelCaseKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
        camelCaseData[camelCaseKey] = convertKeysToCamelCase(data[key]);
      }
    }
    return camelCaseData;
  }
  return data;
}