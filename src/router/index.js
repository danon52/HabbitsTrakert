
import HomeView from '@/homeView.vue'
import RegisterView from '@/registerView.vue'
import SignView from '@/SignView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/logout', name: 'logout', component: SignView
    },
    {
      path: '/', name: 'home', component: HomeView
    },
    {
      path: '/register', name: 'register', component: RegisterView
    }
  ]
})

export default router
