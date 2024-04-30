<template>
  <div class="board-detail">
    <div>
      <button type="button" v-on:click="fnUpdate">수정</button>&nbsp;
      <button type="button" v-on:click="fnDelete">삭제</button>&nbsp;
      <button type="button" v-on:click="fnList">목록</button>
    </div>
    <div class="">
      <span>번호 : {{ id }}</span>
      <h3>제목 : {{ title }}</h3>
      <span>작성자 이름: </span><strong class="w3-large">{{ nickName }}</strong>
      <div>
        <br>
        <span>작성일 : {{ createDate }}</span>
      </div>
    </div>
    <div class="">
      <span>내용 : {{ content }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() { //변수생성
    return {
      requestBody: this.$route.query,
      id: this.$route.query.id,

      title: '',
      nickName: '',
      content: '',
      createDate: ''
    }
  },
  mounted() {
    this.fnGetView()
  },
  methods: {
    fnGetView() {
      this.$axios.get(this.$serverUrl + '/api/board/detail/' + this.id, {
        params: this.requestBody
      }).then((res) => {
        this.title = res.data.title
        this.nickName = res.data.nickName
        this.content = res.data.content
        this.createDate = res.data.createDate
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
    }
  }
}
</script>
<style scoped>

</style>