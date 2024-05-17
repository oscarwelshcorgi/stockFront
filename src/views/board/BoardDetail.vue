<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="btn-group" role="group" aria-label="Button group">
            <button type="button" class="btn btn-primary" @click="fnUpdate">수정</button>
            <button type="button" class="btn btn-danger" @click="fnDelete">삭제</button>
            <button type="button" class="btn btn-secondary" @click="fnList">목록</button>
        </div>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <div class="fw-bold fs-4">{{ title }}</div>
            <div class="fs-5">{{ createDate }}</div>
          </div>
          <div class="card-body">
            <p class="text-start"><strong>{{ nickName }}</strong></p>
            <br>
            <p class="card-text">{{ content }}</p>
          </div>
        </div>
      </div>
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
      createDate: '',
      email: ''
    }
  },
  mounted() {
    this.fnGetView();
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