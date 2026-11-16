<script setup>
import { ref } from 'vue'
import Shell from '@/components/Shell.vue'
import { dash, load, mutate } from '@/dashboard'
import { session } from '@/session'

const error = ref('')
load()

async function onFile(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  error.value = ''
  try {
    const dataUrl = await resize(file)
    await mutate('/api/me', { method: 'PATCH', body: { avatar: dataUrl } })
  } catch (err) {
    error.value = err.message
  }
}

function resize(file) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const size = 256
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const scale = Math.max(size / image.width, size / image.height)
      const width = image.width * scale
      const height = image.height * scale
      canvas.getContext('2d').drawImage(image, (size - width) / 2, (size - height) / 2, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    image.onerror = () => reject(new Error('Не удалось прочитать фото'))
    image.src = URL.createObjectURL(file)
  })
}

async function clearPhoto() {
  error.value = ''
  try { await mutate('/api/me', { method: 'PATCH', body: { avatar: null } }) }
  catch (err) { error.value = err.message }
}

const maxSpark = () => Math.max(...(dash.data?.profile.spark.map((item) => item.value) || [1]), 1)
</script>

<template>
  <Shell>
    <main class="page" v-if="dash.data">
      <div class="profile-top">
        <div class="who">
          <span class="avatar lg" :class="{ frame: session.user.frame }">
            <img v-if="session.user.avatar" :src="session.user.avatar" alt="">
            <span v-else>{{ session.user.initials }}</span>
          </span>
          <div class="identity">
            <h1>{{ session.user.name }}</h1>
            <p class="kicker">{{ session.user.email }}</p>
            <p class="quiet">{{ dash.data.profile.since }}</p>
            <div class="actions">
              <label class="btn ghost small">Сменить фото<input type="file" accept="image/*" hidden @change="onFile"></label>
              <button v-if="session.user.avatar" class="btn ghost small" @click="clearPhoto">Убрать</button>
            </div>
          </div>
        </div>
        <div class="facts">
          <strong>{{ dash.data.profile.facts[0] }}</strong>
          <span class="kicker">{{ dash.data.profile.facts[1] }}</span>
          <span class="kicker">{{ dash.data.profile.facts[2] }}</span>
          <span class="brass">{{ dash.data.profile.facts[3] }}</span>
        </div>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <p class="quiet">Снимок встанет на место инициалов. Его видно только в этом профиле.</p>
      <h2 class="block-title">{{ dash.data.profile.monthLabel }}</h2>
      <div class="sparkline">
        <i
          v-for="day in dash.data.profile.spark"
          :key="day.iso"
          :class="{ today: day.today, future: day.future }"
          :style="{ height: `${day.future ? 6 : Math.max(6, (day.value / maxSpark()) * 44)}px` }"
        />
      </div>
      <p class="quiet">{{ dash.data.profile.sparkNote }}</p>
      <h2 class="block-title">Как идут привычки</h2>
      <section class="list">
        <article v-for="habit in dash.data.profile.habits" :key="habit.name" class="habit-line">
          <div class="name"><i class="line-swatch" :style="{ background: habit.color }" />{{ habit.name }}</div>
          <div class="track"><i :style="{ width: `${(habit.done / habit.total) * 100}%`, background: habit.color }" /></div>
          <span class="kicker">{{ habit.label }}</span>
        </article>
        <p v-if="!dash.data.profile.habits.length" class="empty" style="padding: 12px 0">Привычек пока нет.</p>
      </section>
      <p class="quiet tablet-only">Настройки, календарь и статистика — в меню сверху на широком экране. Здесь они рядом.</p>
      <div class="links tablet-only">
        <RouterLink to="/settings">Настройки</RouterLink>
        <RouterLink to="/calendar">Календарь</RouterLink>
        <RouterLink to="/stats">Статистика</RouterLink>
      </div>
    </main>
  </Shell>
</template>
