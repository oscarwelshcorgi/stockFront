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

    goToDetail(id) {
      this.$router.push({
        path: '/board/detail/' + id,
        query: { id: id }
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