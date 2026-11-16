<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Heatmap from '@/components/Heatmap.vue'
import Shell from '@/components/Shell.vue'
import { todayISO } from '@/api'
import { dash, load, mutate } from '@/dashboard'
import { session } from '@/session'

const route = useRoute()
const router = useRouter()
const filter = ref('all')
const error = ref('')
const filters = [
  { id: 'all', label: 'Все' },
  { id: 'morning', label: 'Утро' },
  { id: 'day', label: 'День' },
  { id: 'evening', label: 'Вечер' },
]
const home = computed(() => dash.data?.home)
const visible = computed(() => (home.value?.habits || []).filter((habit) => filter.value === 'all' || habit.period === filter.value || habit.period === 'any'))

async function open(iso) {
  await router.replace({ query: { date: iso } })
}

async function toggle(habit) {
  if (habit.future) return
  error.value = ''
  try {
    await mutate(`/api/habits/${habit.id}/toggle`, { method: 'POST', body: { date: route.query.date || todayISO() } })
  } catch (err) {
    error.value = err.message
  }
}

watch(() => route.query.date, (date) => load({ date: date || '' }), { immediate: true })

onMounted(() => {
  const user = session.user
  if (!user?.reminders || sessionStorage.getItem('ritm-reminded') === todayISO()) return
  const habits = dash.data?.home?.habits || []
  if (!habits.length || habits.every((habit) => habit.done)) return
  const now = new Date()
  const minutes = now.getHours() * 60 + now.getMinutes()
  const toMin = (value) => {
    const [h, m] = value.split(':').map(Number)
    return h * 60 + m
  }
  const start = toMin(user.quietStart)
  const end = toMin(user.quietEnd)
  const quiet = start < end ? minutes >= start && minutes < end : minutes >= start || minutes < end
  if (quiet || now.getHours() < 18) return
  sessionStorage.setItem('ritm-reminded', todayISO())
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Ритм', { body: 'День ещё не закрыт.' })
  }
})
</script>

<template>
  <Shell>
    <main class="page" v-if="home">
      <p class="date-line">{{ home.dateLabel }}</p>
      <div class="head">
        <div>
          <h1>{{ home.greeting }}</h1>
          <p class="sub">{{ home.subtitle }}</p>
        </div>
        <RouterLink class="btn primary" to="/habits">+  Новая привычка</RouterLink>
      </div>
      <div class="week">
        <button
          v-for="day in home.week"
          :key="day.iso"
          class="day"
          :class="{ today: day.today, selected: day.selected }"
          @click="open(day.iso)"
        >
          <small>{{ day.name }}</small>
          <b>{{ day.num }}</b>
          <i :class="{ closed: day.closed }" />
        </button>
      </div>
      <div class="links phone-only">
        <RouterLink to="/calendar">Календарь</RouterLink>
        <RouterLink to="/stats">Статистика</RouterLink>
      </div>
      <section class="cards">
        <article class="card">
          <span class="kicker">Ближайшая награда</span>
          <div class="row" style="gap:12px">
            <span class="medal">{{ home.reward.n }}</span>
            <div>
              <strong>{{ home.reward.title }}</strong>
              <p class="kicker">{{ home.reward.left }}</p>
            </div>
          </div>
          <div class="track"><i :style="{ width: `${home.reward.pct * 100}%` }" /></div>
        </article>
        <article class="card">
          <span class="kicker">Эта неделя</span>
          <div class="metrics">
            <p class="metric"><b class="moss">{{ home.weekStats.pct }}%</b><span>выполнено</span></p>
            <p class="metric"><b>{{ home.weekStats.streak }}</b><span>дней серии</span></p>
            <p class="metric"><b class="brass">{{ home.weekStats.awards }}</b><span>награды</span></p>
          </div>
        </article>
        <article class="card warm">
          <span class="kicker">Огоньки</span>
          <div class="fire-row">
            <strong>{{ home.points }}</strong>
            <span class="kicker">+{{ home.pointsToday }} сегодня</span>
          </div>
        </article>
      </section>
      <div class="section-head">
        <h2>Привычки на сегодня</h2>
        <div class="chips">
          <button v-for="item in filters" :key="item.id" class="chip" :class="{ on: filter === item.id }" @click="filter = item.id">{{ item.label }}</button>
        </div>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="!visible.length" class="empty">На этот день и фильтр привычек нет.</p>
      <section class="habit-grid">
        <article v-for="habit in visible" :key="habit.id" class="card">
          <div class="habit-top">
            <i class="swatch" :style="{ background: habit.color }" />
            <button class="check" :class="{ on: habit.done }" :style="habit.done ? { background: habit.color } : {}" :disabled="habit.future" @click="toggle(habit)">{{ habit.done ? '✓' : '' }}</button>
          </div>
          <strong>{{ habit.name }}</strong>
          <p class="kicker">{{ habit.meta }}</p>
          <div class="dots">
            <i v-for="(on, index) in habit.dots" :key="index" :style="on ? { background: habit.color } : {}" />
          </div>
        </article>
      </section>
      <Heatmap :title="`Активность за ${home.heat.length} недель`" :aside="`${home.totalDone} выполнений`" :columns="home.heat" />
    </main>
    <p v-else-if="dash.error" class="page error">{{ dash.error }}</p>
  </Shell>
</template>
