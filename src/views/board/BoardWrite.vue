<template>
  <div>
    <h1>회원 정보</h1>
    <div v-if="memberInfo">
      <p>Email: {{ memberInfo.email }}</p>
      <p>nickName: {{ memberInfo.nickName }}</p>
    </div>
    <div v-else>
      <p>회원 정보를 불러오는 중입니다...</p>
    </div>

    <h1>게시글 작성</h1>
    <form @submit.prevent="submitPost">
      <label for="title">제목:</label>
      <input type="text" id="title" v-model="post.title" required placeholder="제목을 입력해주세요.">
      <label for="content">내용:</label>
      <textarea id="content" v-model="post.content" required placeholder="내용을 입력해주세요." rows="5"></textarea>
      <button type="submit">{{ post.id ? '게시글 수정' : '게시글 작성' }}</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      requestBody: this.$route.query,
      id: this.$route.query.id,
      post: {
        id: null,
        title: '',
        content: ''
      }
    };
  },
  computed: {
    memberInfo() {
      return this.$store.getters.getMemberInfo;
    }
  },
  created() {
    this.fetchMemberInfo();
    this.fnEditPost(); // 컴포넌트 생성 시 게시글 수정 모드로 진입. id 가져와서 해당 게시글 데이터 출력
  },
  methods: {
    fetchMemberInfo() {
      this.$store.dispatch('fetchMemberInfo')
        .then(() => {
          console.log('회원 정보를 성공적으로 가져왔습니다.');
        })
        .catch(error => {
          console.error('회원 정보를 가져오는 중 오류 발생:', error);
        });
    },
    submitPost() {
      if (!this.memberInfo) {
        console.error('회원 정보를 가져올 수 없습니다.');
        return;
      }

      this.post.nick_name = this.memberInfo.nickName;
      this.post.email = this.memberInfo.email;

      const apiUrl = `${this.$serverUrl}/api/board/${this.post.id ? 'update' : 'create'}`;
      const method = this.post.id ? 'patch' : 'post';

      this.$axios[method](apiUrl, this.post)
        .then(response => {
          const postId = response.data.id;
          alert('게시글이 저장되었습니다.');

          if (postId) {
            this.$router.push({
              path: '/board/boardDetail',
              query: this.requestBody
            }); // 저장된 게시글 상세 페이지로 이동
          } else {
            console.error('저장된 게시글의 ID를 가져올 수 없습니다.');
          }
        })
        .catch(error => {
          console.error('게시글 저장 실패:', error);
          alert('게시글 저장 중 오류가 발생했습니다.');
        });
    },
    fnEditPost() {
      if (this.id) {
        const apiUrl = `${this.$serverUrl}/api/board/detail/${this.id}`;

        this.$axios.get(apiUrl)
          .then(response => {
            const { id, title, content } = response.data;
            this.post = { id, title, content };
          })
          .catch(error => {
            console.error('게시글 정보를 가져오는 중 오류 발생:', error);
          });
      }
    }
  }
};
</script>