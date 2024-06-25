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
            <div ref="editor" class="quill-viewer" v-html="content" style="margin-top: 20px; margin-bottom: 20px; border:0; font-size: 20px;"></div>
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
    }
  }
}
</script>
<style scoped>

</style>