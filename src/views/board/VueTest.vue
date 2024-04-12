<template>
  <div class="about">
    <h1>{{ testData }}</h1>
    <h1>프론트</h1>
  </div>
</template>
<script>
export default {
  name: "VueTest",
  components: [],
  data() {
    return {
      testData: "",
    };
  },
  methods: {
    get() {
      this.axios.get("/api/testVue").then((response) => {
        this.testData = response.data;
      });
    },
  },
  mounted() {
    this.get();
  },
};
</script>