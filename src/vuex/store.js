import { createStore } from 'vuex';
import axios from 'axios';

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
        // 서버의 세션 정보를 가져오는 API 요청
        axios.get('http://localhost:8080/api/memberInfo', { withCredentials: true })
          .then(response => {
            // 성공적으로 회원 정보를 받아와 Vuex 상태에 저장
            commit('setMemberInfo', response.data);
            resolve(response.data); // Promise resolve
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