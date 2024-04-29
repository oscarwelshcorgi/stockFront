<template>
  <div class="board-detail">
    <div class="common-buttons">
      <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnSave">저장</button>&nbsp;
      <button type="button" class="w3-button w3-round w3-gray" v-on:click="fnList">목록</button>
    </div>
    <div class="board-contents">
      <input type="text" v-model="title" class="w3-input w3-border" placeholder="제목을 입력해주세요.">
      <input type="text" v-model="nickName" class="w3-input w3-border" placeholder="작성자를 입력해주세요." v-if="id === undefined">
    </div>
    <div class="board-contents">
      <textarea id="" cols="30" rows="10" v-model="content" class="w3-input w3-border" style="resize: none;">
      </textarea>
    </div>
    <div class="common-buttons">
      <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnSave">저장</button>&nbsp;
      <button type="button" class="w3-button w3-round w3-gray" v-on:click="fnList">목록</button>
    </div>
  </div>
</template>

<script>
export default {
  data() { //변수생성
    return {
        member: null,
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
      if (this.id !== undefined) {
        this.$axios.get(this.$serverUrl + '/board/' + this.id, {
          params: this.requestBody
        }).then((res) => {
          this.title = res.data.title
          this.nickName = res.data.nickName
          this.contents = res.data.content
          this.createDate = res.data.createDate
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    fnList() {
      delete this.requestBody.id
      this.$router.push({
        path: './boardList',
        query: this.requestBody
      })
    },
    fnView(id) {
      this.requestBody.id = id
      this.$router.push({
        path: './boardDetail',
        query: this.requestBody
      })
    },
    fnSave() {
      let apiUrl = this.$serverUrl + '/api/board/create'
      this.form = {
        "id": this.id,
        "title": this.title,
        "content": this.content,
        "nickName": this.nickName,
      }

      if (this.id === undefined) {
        //INSERT
        this.$axios.post(apiUrl, this.form)
        .then((res) => {
          alert('글이 저장되었습니다.')
          this.fnView(res.data.id)
        }).catch((err) => {
          if (err.message.indexOf('Network Error') > -1) {
            alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.')
          }
        })
      } else {
        //UPDATE
        this.$axios.patch(apiUrl, this.form)
        .then((res) => {
          alert('글이 저장되었습니다.')
          this.fnView(res.data.id)
        }).catch((err) => {
          if (err.message.indexOf('Network Error') > -1) {
            alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.')
          }
        })
      }
    },
  }
}
</script>
<style scoped>

</style>