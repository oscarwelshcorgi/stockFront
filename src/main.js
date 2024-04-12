import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'

const app = createApp(App)
app.mount('#app')
axios.default.baseURL = "http://localhsot:8080"
app.config.globalProperties.axios = axios;