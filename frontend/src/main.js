import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import VueCalendarHeatmap from 'vue-calendar-heatmap'
const app = createApp(App)

app.use(router, VueCalendarHeatmap)


app.mount('#app')
