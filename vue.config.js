const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  // 개발 서버 설정
  devServer: {
    // 개발 서버 포트 설정
    port: 8080, // 원하는 포트로 변경 가능

    // 개발 서버 호스트 설정 (로컬 호스트 사용)
    host: 'localhost',

    // CORS 관련 설정은 벡엔드에서.. 여기서 proxy 설정을 하여 CORS 정책을 우회할 수 있지만 서버 측에서 하는게 안전함.
})
