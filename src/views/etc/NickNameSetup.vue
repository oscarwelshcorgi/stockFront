<template>
  <div class="container">
    <h2>닉네임 설정</h2>
    <form @submit.prevent="submitNickName">
      <div class="mb-3">
        <label for="nickName" class="form-label">닉네임</label>
        <input type="text" class="form-control" id="nickName" v-model="nickName" required>
      </div>
      <button type="submit" class="btn btn-primary">저장</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nickname: ''
    };
  },
  methods: {
    submitNickName() {
      // 닉네임을 서버로 전송하는 로직
      this.$store.dispatch('updateNickName', this.nickName)
        .then(() => {
          // 성공적으로 닉네임을 설정한 후 리디렉션
          this.$router.push('/');
        })
        .catch(error => {
          console.error('Failed to update nickName:', error);
        });
    }
  }
};
</script>