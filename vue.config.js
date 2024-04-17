const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  // 개발 서버 설정
  devServer: {
    // 개발 서버 포트 설정
    port: 3030, // 원하는 포트로 변경 가능

    // 개발 서버 호스트 설정 (로컬 호스트 사용)
    host: 'localhost',

    // CORS 관련 설정은 따로 추가할 필요 없음
    }
})
