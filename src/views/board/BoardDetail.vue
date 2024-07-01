<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <!-- 세션 정보가 있고 이메일이 같은 경우에만 보이는 버튼 -->
        <div class="btn-group" role="group" aria-label="Button group">
          <button v-if="hasMemberInfo && isCurrentUser" type="button" class="btn btn-primary" @click="fnUpdate">수정</button>
          <button v-if="hasMemberInfo && isCurrentUser" type="button" class="btn btn-danger" @click="fnDelete">삭제</button>
          <button type="button" class="btn btn-secondary" @click="fnList">목록</button>
        </div>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <div class="fw-bold fs-4">{{ title }}</div>
            <div class="fs-5"><strong>작성자: {{ nickName }}, 작성일: {{ createDate }}, 조회수: {{ viewCount }}</strong></div>
          </div>
          <div class="card-body">
            <div ref="editor" class="quill-viewer" v-html="content" style="margin-top: 20px; margin-bottom: 20px; border: 0; font-size: 20px;"></div>
          </div>
        </div>

        <div>
          <BoardList :list="boardList" :paging="paging" @postClicked="onPostClicked">
            <template v-slot:search>
              <h1>-----------------------------------------------</h1>
            </template>
          </BoardList>
        </div>
      </div>
    </div>

	<div class="bottom_ad">
        <!-- 애드핏 -->
        <ins class="kakao_ad_area" style="display:none;"
            data-ad-unit = "DAN-rJHzRSsW6ZKje7Ak"
            data-ad-width = "320"
            data-ad-height = "50"></ins>

    <!-- 애드센스 하단광고 -->
    <!--
        <ins class="adsbygoogle"
             style="display:inline-block;width:100%;height:50px"
             data-ad-client="ca-pub-1107226096880396"
             data-ad-slot="6012089010"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
     -->
	</div>

    <!-- 하단 메뉴 -->
    <div class="row mt-3">
      <div class="col-md-12">
        <div class="bottom_menu d-flex justify-content-between">
          <div>
            <img src="@/assets/back.png" alt="Back" v-on:click="goBack" style="cursor: pointer;"/>
          </div>

          <div v-if="nextBoardId !== null">
            <router-link v-if="nextBoardId !== null" :to="'/board/boardDetail?id=' + nextBoardId + '&page=' + page" @click="onNavigationClick(nextBoardId)">
              <img src="@/assets/up.png" alt="up"/>
            </router-link>
          </div>

          <div v-if="previousBoardId !== null">
            <router-link v-if="previousBoardId !== null" :to="'/board/boardDetail?id=' + previousBoardId + '&page=' + page" @click="onNavigationClick(previousBoardId)">
              <img src="@/assets/down.png" alt="Previous"/>
            </router-link>
          </div>

          <!-- 로그인 시 마이 페이지 이동, 비로그인 시 로그인 페이지로 이동 -->
          <div>
            <router-link to="/usr/member/myPage" v-if="hasMemberInfo">
              <img src="@/assets/face.png"/>
            </router-link>
            <router-link to="/usr/member/myPage" v-if="hasMemberInfo !== null">로그인X
              <img src="@/assets/face.png"/>
            </router-link>
          </div>

          <div>
            <img src="@/assets/setting.png" style="cursor: pointer;"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Quill from 'quill'; // Quill 라이브러리 임포트
import BoardList from './BoardList';
import { useMeta } from 'vue-meta';

export default {
  components: {
      BoardList
  },


  data() { //변수생성
    return {
      requestBody: this.$route.query,
      id: this.$route.query.id,
      title: '',
      nickName: '',
      content: '',
      createDate: '',
      email: '',
      viewCount: '',
      boardList: [], // BoardList의 게시글 리스트 데이터
      previousBoardId: '',// 이전 글 ID
      nextBoardId: '', // 다음 글 ID
      page: 1,
    }
  },
  mounted() {
    this.fnGetView();

    // 광고 스크립트를 동적으로 로드
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
    script.async = true;
    document.body.appendChild(script);

    // 스크립트 로드 후 광고 영역 초기화
    script.onload = () => {
      // 광고 영역 초기화
      window.kakaoAsyncLoad = () => {
        window.kakaoAd = window.kakaoAd || {};
        window.kakaoAd.async = true;
        window.kakaoAd.renderAd(this.$refs.kakaoAd);
      };
    };

    // Quill 에디터 초기화
    this.quill = new Quill(this.$refs.editor, {
      theme: 'snow',
      modules: {
        toolbar: false // 툴바를 비활성화하여 옵션 버튼을 제거합니다.
      },
      readOnly: true
    });
    // Quill 에디터가 정상적으로 작동하지 않으면 메시지 출력
    if (!this.quill) {
      console.error("Quill editor initialization failed.");
    }
    // Quill 에디터에 게시글 내용 표시
    this.quill.root.innerHTML = this.content;
  },

  computed: {
    // Vuex 스토어에서 세션 정보를 가져오는 computed 속성
    memberInfo() {
      return this.$store.getters.getMemberInfo;
    },
    // 세션 정보가 있는지 확인하는 computed 속성
    hasMemberInfo() {
      return !!this.memberInfo;
    },
    // 현재 사용자의 이메일과 세션 정보의 이메일을 비교하여 동일한 경우 true를 반환하는 computed 속성
    isCurrentUser() {
      return this.hasMemberInfo && this.memberInfo.email === this.email;
    }
  },

  methods: {
    fnGetView() {
      this.$axios.get(this.$serverUrl + '/api/board/detail/' + this.id, {
        params: this.requestBody
      }).then((res) => {
        this.id = res.data.id
        this.title = res.data.title
        this.nickName = res.data.nickName
        this.content = res.data.content
        this.createDate = res.data.createDate
        this.email = res.data.email
        this.viewCount = res.data.viewCount
        this.previousBoardId = res.data.previousBoardId; // 서버에서 전달된 이전 글의 ID
        this.nextBoardId = res.data.nextBoardId; // 서버에서 전달된 다음 글의 ID
        // BoardList의 게시글 리스트 데이터 업데이트
        this.boardList = res.data.boardList;
        // 비동기로 가져온 데이터를 바탕으로 메타 정보 설정
        this.setDynamicMeta(res.data);
      }).catch((err) => {
        if (err.message.indexOf('Network Error') > -1) {
          alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.')
        }
      })
    },

    fnList() {
      delete this.requestBody.id
      this.$router.push({
        path: './boardList',
        query: this.requestBody
      })
    },

    fnUpdate() {
      this.$router.push({
        path: './boardWrite',
        query: this.requestBody
      })
    },
    fnDelete() {
      if (!confirm("삭제하시겠습니까?")) return

      this.$axios.delete(this.$serverUrl + '/api/board/delete/' + this.id, {})
          .then(() => {
            alert('삭제되었습니다.')
            this.fnList();
          }).catch((err) => {
        console.log(err);
      })
    },

    // BoardList에서 게시글 제목 클릭 시 호출될 메서드
    onPostClicked(row) {
      // 선택된 게시글의 id로 URL을 변경하여 해당 게시글로 이동
      this.$router.push({
        path: './boardDetail',
        query: { id: row.id }
      });
      // 선택된 게시글의 데이터로 상세 정보 업데이트
      this.updateViewData(row);
      // 조회수 증가 API 호출
      this.increaseViewCount(row.id);
    },
    // 상세 정보 업데이트 메서드
    updateViewData(data) {
      this.id = data.id;
      this.title = data.title;
      this.nickName = data.nickName;
      this.content = data.content;
      this.createDate = data.createDate;
      this.email = data.email;
      this.viewCount = data.viewCount;
      // Quill 에디터에 게시글 내용 표시
      if (this.quill) {
        this.quill.root.innerHTML = this.content;
      }
    },
    // 조회수 증가 API 호출 메서드
    increaseViewCount(id) {
      this.$axios.put(this.$serverUrl + '/api/board/increaseViewCount/' + id)
        .then(() => {
          // 조회수 증가 성공
          console.log('조회수가 증가되었습니다.');
        }).catch((err) => {
          // 조회수 증가 실패
          console.error('조회수 증가 중 오류가 발생했습니다.', err);
        });
    },

    // 이전 글 또는 다음 글 클릭 시 호출되는 메서드
    onNavigationClick(id) {
      this.$axios.get(this.$serverUrl + '/api/board/detail/' + id)
        .then((res) => {
          this.updateViewData(res.data);

          // URL을 변경하여 해당 게시글로 이동
          this.$router.push({
            path: '/board/boardDetail?id=' + id,
            query: { id: id }
          });
          this.increaseViewCount(res.data.id);
          this.refreshPage();
        }).catch((err) => {
          console.error('이전 글 또는 다음 글 조회 중 오류가 발생했습니다.', err);
        });
    },

    // 브라우저 히스토리에서 이전 페이지로 이동
    goBack() {
      this.$router.go(-1);
    },
    // 클릭 시 페이지 리프레시
    refreshPage() {
      window.location.reload();
    },

    // meta 태그 셋팅
    setDynamicMeta(data) {
      const dynamicMeta = {
        id: data.id,
        title: data.title,
        description: '에펨, 펨코, 팸코, fmkorea, fm, 디시, 디시인사이드, dc, dcinside, 커뮤, 커뮤니티, 오유, 오늘의유머, 웃대, 웃긴대학, 짱공유, 고급유머, 깨글, 개그, gag, 9gag, 레딧, radit  -동까유머',
        keywords: '동까 유머, 재미있는 각종 유머글 모음 사이트, 유머 사이트 추천, 심심할 때,유머 모음, 재밌는 글, 유머 게시판 -동까유머',
        ogType: 'website',
        ogTitle: data.title + ' -동까유머',
        ogDescription: data.content + ' -동까유머',
        ogUrl: 'https://dongga.net/board/boardDetail?id=' + data.id,
        ogImage: data.content,
      };
      console.log('Setting dynamic meta with:', dynamicMeta);

      // useMeta를 이용하여 동적으로 title, meta 태그 등을 설정
      useMeta({
        title: dynamicMeta.title || process.env.VUE_APP_TITLE,
        meta: [
          { vmid: 'description', name: 'description', content: dynamicMeta.description },
          { vmid: 'keywords', name: 'keywords', content: dynamicMeta.keywords },
          { vmid: 'og:type', name: 'og:type', content: dynamicMeta.ogType},
          { vmid: 'og:title', name: 'og:title', content: dynamicMeta.ogTitle },
          { vmid: 'og:description', name: 'og:description', content: dynamicMeta.ogDescription },
          { vmid: 'og:url', name: 'og:url', content: dynamicMeta.ogUrl },
          { vmid: 'og:image', name: 'og:image', content: dynamicMeta.ogImage }
        ]
      });
    },

  }
}
</script>

<style>
img {
    max-width: 90%;
    height: auto;
    object-fit: cover;
}
video {
    max-width: 90%;
    height: auto;
    object-fit: cover;
}
.bottom_menu {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 40px;
    z-index: 100;
    border-top: 1px solid black;
    background-color: white;
}
.bottom_menu > div {
    float: left;
    width: 20%;
    height: 100%;
    text-align: center;
    padding-top: 0px;
}
.bottom_ad {
    position: fixed;
    bottom: 30px;
    left: 0px;
    width: 100%;
    height: 50px;
    z-index: 100;
    border-top: 1px solid black;
    background-color: white;
    margin-bottom: 9px;
}
</style>