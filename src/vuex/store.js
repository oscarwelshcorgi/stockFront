import { createStore } from 'vuex';
import axios from 'axios';
import { convertKeysToCamelCase } from '@/vuex/convertToCamel';

const store = createStore({
  state() {
    return {
      memberInfo: null // 초기에는 회원 정보가 없음
    };
  },
  mutations: {
    setMemberInfo(state, memberInfo) {
      state.memberInfo = memberInfo;
    }
  },
  actions: {
    fetchMemberInfo({ commit }) {
      return new Promise((resolve, reject) => {
        // 세션 정보를 가져오는 API 엔드포인트 설정
        //const apiUrl = 'http://localhost:8080//humorBoard/Info'; //개발
        const apiUrl = 'https://dongga.net:8080/api/memberInfo'; //운영

        // Axios를 사용하여 세션 정보 요청
        axios.get(apiUrl, { withCredentials: true }) // withCredentials 옵션을 통해 쿠키를 전달

          .then(response => {
            // 성공적으로 데이터를 받아왔을 때 처리
            const transformedData = convertKeysToCamelCase(response.data);
            commit('setMemberInfo', transformedData);
            resolve(transformedData); // Promise resolve
          })
          .catch(error => {
            console.error('Failed to fetch member info:', error);
            reject(error); // Promise reject
          });
      });
    }
  },
  getters: {
    getMemberInfo(state) {
      return state.memberInfo;
    }
  }
});

export default store;

// Vue Router를 이용한 페이지 이동 로직을 추가
import router from '@/router'; // Vue Router 인스턴스를 가져옴

store.watch(
  (state, getters) => getters.getMemberInfo,
  (newMemberInfo) => {
    if (newMemberInfo && newMemberInfo.checkNickName) {
      // checkNickName이 true이면 닉네임 설정 페이지로 이동
      router.push('/etc/NickNameSetup');
    }
  }
);