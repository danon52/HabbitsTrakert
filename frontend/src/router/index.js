import { createRouter, createWebHistory } from 'vue-router'
import { api } from '@/api'
import { dash, load } from '@/dashboard'
import { readToken, session } from '@/session'
import AuthView from '@/views/AuthView.vue'
import TodayView from '@/views/TodayView.vue'
import HabitsView from '@/views/HabitsView.vue'
import StatsView from '@/views/StatsView.vue'
import CalendarView from '@/views/CalendarView.vue'
import RewardsView from '@/views/RewardsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import SettingsView from '@/views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/today' },
    { path: '/login', name: 'login', component: AuthView, props: { mode: 'login' }, meta: { guest: true } },
    { path: '/register', name: 'register', component: AuthView, props: { mode: 'register' }, meta: { guest: true } },
    { path: '/reset', name: 'reset', component: AuthView, props: { mode: 'reset' }, meta: { guest: true } },
    { path: '/today', name: 'today', component: TodayView, meta: { auth: true } },
    { path: '/habits', name: 'habits', component: HabitsView, meta: { auth: true } },
    { path: '/stats', name: 'stats', component: StatsView, meta: { auth: true } },
    { path: '/calendar', name: 'calendar', component: CalendarView, meta: { auth: true } },
    { path: '/rewards', name: 'rewards', component: RewardsView, meta: { auth: true } },
    { path: '/profile', name: 'profile', component: ProfileView, meta: { auth: true } },
    { path: '/settings', name: 'settings', component: SettingsView, meta: { auth: true } },
  ],
})

router.beforeEach(async (to) => {
  if (!session.ready) {
    session.token = readToken()
    if (session.token) {
      try {
        session.user = await api('/api/me')
        await load()
      } catch {
        session.token = ''
        session.user = null
        dash.data = null
      }
    }
    session.ready = true
  }
  if (to.meta.auth && !session.user) return { name: 'login' }
  if (to.meta.guest && session.user) return { name: 'today' }
  return true
})

export default router
