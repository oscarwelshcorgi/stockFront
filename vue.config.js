const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  // npm run build 타겟 디렉토리 (백엔드쪽!)
  //outputDir: "/Users/gi/Downloads/dgBack/src/main/resources/static",
  // npm run serve 개발 진행시에 포트가 다르기때문에 프록시 설정
  devServer: {
      // 프록시 설정
        proxy: {
        '/api': {
        //target: 'https://localhost:8080', //개발
        target: 'https://dongga.net:8080', //운영
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
})
