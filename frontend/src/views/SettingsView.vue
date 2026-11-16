<script setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Shell from '@/components/Shell.vue'
import { api } from '@/api'
import { dash, load, mutate } from '@/dashboard'
import { clearSession, session } from '@/session'

const router = useRouter()
const error = ref('')
const editing = ref('')
const draft = reactive({ name: '', email: '', quietStart: '', quietEnd: '', weekStart: 'monday' })

load()
watch(() => session.user, (user) => {
  if (!user) return
  draft.name = user.name
  draft.email = user.email
  draft.quietStart = user.quietStart
  draft.quietEnd = user.quietEnd
  draft.weekStart = user.weekStart
}, { immediate: true })

async function save(body) {
  error.value = ''
  try {
    await mutate('/api/me', { method: 'PATCH', body })
    editing.value = ''
  } catch (err) {
    error.value = err.message
  }
}

async function logout() {
  try { await api('/api/auth/logout', { method: 'POST' }) } catch { /* уже вышли */ }
  clearSession()
  dash.data = null
  router.push('/login')
}
</script>

<template>
  <Shell>
    <main class="page" v-if="session.user">
      <div class="head">
        <div>
          <h1>Настройки</h1>
          <p class="sub">Короткий список. Всё, что меняет день, живёт в привычках.</p>
        </div>
      </div>
      <div class="center">
        <section class="list settings">
          <article class="setting">
            <div>
              <strong>Имя</strong>
              <input v-if="editing === 'name'" v-model="draft.name" @keyup.enter="save({ name: draft.name })">
              <p v-else>{{ session.user.name }}</p>
            </div>
            <button class="text-link" @click="editing === 'name' ? save({ name: draft.name }) : editing = 'name'">{{ editing === 'name' ? 'Сохранить' : 'Изменить' }}</button>
          </article>
          <article class="setting">
            <div>
              <strong>Почта</strong>
              <input v-if="editing === 'email'" v-model="draft.email" @keyup.enter="save({ email: draft.email })">
              <p v-else>{{ session.user.email }}</p>
            </div>
            <button class="text-link" @click="editing === 'email' ? save({ email: draft.email }) : editing = 'email'">{{ editing === 'email' ? 'Сохранить' : 'Изменить' }}</button>
          </article>
          <article class="setting">
            <div>
              <strong>Напоминания</strong>
              <p>Вечером, если день не закрыт</p>
            </div>
            <button class="toggle" :class="{ on: session.user.reminders }" @click="save({ reminders: !session.user.reminders })"><i /></button>
          </article>
          <article class="setting">
            <div>
              <strong>Начало недели</strong>
              <p>{{ session.user.weekStart === 'sunday' ? 'Воскресенье' : 'Понедельник' }}</p>
            </div>
            <button class="text-link" @click="save({ weekStart: session.user.weekStart === 'sunday' ? 'monday' : 'sunday' })">Изменить</button>
          </article>
          <article class="setting">
            <div>
              <strong>Тихие часы</strong>
              <p v-if="editing !== 'quiet'">{{ session.user.quietStart }} — {{ session.user.quietEnd }}</p>
              <div v-else class="actions">
                <input v-model="draft.quietStart" type="time">
                <input v-model="draft.quietEnd" type="time">
              </div>
            </div>
            <button class="text-link" @click="editing === 'quiet' ? save({ quietStart: draft.quietStart, quietEnd: draft.quietEnd }) : editing = 'quiet'">{{ editing === 'quiet' ? 'Сохранить' : 'Изменить' }}</button>
          </article>
        </section>
      </div>
      <p v-if="error" class="error" style="text-align:center">{{ error }}</p>
      <div class="logout"><button class="clay" @click="logout">Выйти</button></div>
    </main>
  </Shell>
</template>

<style scoped>
input {
  background: var(--field);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 8px 10px;
  margin-top: 6px;
}
</style>
