<script setup>
import { ref } from 'vue'
import Awards from '@/components/Awards.vue'
import Shell from '@/components/Shell.vue'
import { dash, load, mutate } from '@/dashboard'

const error = ref('')
const earn = [
  ['5', 'Отмеченная привычка'],
  ['20', 'День закрыт целиком'],
  ['15', 'Каждые 7 дней серии'],
]
load()

async function act(item) {
  error.value = ''
  try {
    if (item.action === 'use') await mutate('/api/pause', { method: 'POST' })
    else await mutate(`/api/shop/${item.id}`, { method: 'POST' })
  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <Shell>
    <main class="page" v-if="dash.data">
      <div class="head">
        <div>
          <h1>Награды</h1>
          <p class="sub">{{ dash.data.rewards.subtitle }}</p>
        </div>
      </div>
      <article class="card balance">
        <div class="balance-row">
          <div>
            <span class="kicker">Сейчас на счету</span>
            <strong>{{ dash.data.rewards.points }}</strong>
          </div>
          <span class="kicker">+{{ dash.data.rewards.pointsToday }} сегодня</span>
        </div>
      </article>
      <h2 class="block-title">Как копятся</h2>
      <section class="earn">
        <article v-for="item in earn" :key="item[1]" class="card">
          <strong>{{ item[0] }}</strong>
          <span class="kicker">{{ item[1] }}</span>
        </article>
      </section>
      <h2 class="block-title">На что хватает</h2>
      <p v-if="error" class="error">{{ error }}</p>
      <section class="list">
        <article v-for="item in dash.data.rewards.shop" :key="item.id" class="shop-row">
          <div>
            <strong>{{ item.title }}</strong>
            <p>{{ item.desc }}</p>
            <p v-if="item.note">{{ item.note }}</p>
          </div>
          <button class="price" :disabled="item.disabled" @click="act(item)">{{ item.actionLabel }}</button>
        </article>
      </section>
      <h2 class="block-title">Отметки пути</h2>
      <Awards :awards="dash.data.rewards.awards" />
    </main>
  </Shell>
</template>
