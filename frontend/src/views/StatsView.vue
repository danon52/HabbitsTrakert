<script setup>
import Awards from '@/components/Awards.vue'
import Heatmap from '@/components/Heatmap.vue'
import Shell from '@/components/Shell.vue'
import { dash, load } from '@/dashboard'

load()
const maxBar = 128
</script>

<template>
  <Shell>
    <main class="page" v-if="dash.data">
      <div class="head">
        <div>
          <h1>Статистика</h1>
          <p class="sub">Последние 14 недель — без сравнения с кем-либо ещё.</p>
        </div>
      </div>
      <section class="panel stat-strip">
        <article v-for="item in dash.data.stats.metrics" :key="item.label">
          <b :class="item.color">{{ item.value }}</b>
          <span>{{ item.label }}</span>
        </article>
      </section>
      <section class="charts">
        <article class="card">
          <strong>По дням недели</strong>
          <p class="kicker">{{ dash.data.stats.weekdayNote }}</p>
          <div class="bars">
            <div v-for="bar in dash.data.stats.weekday" :key="bar.name">
              <i :class="{ best: bar.best }" :style="{ height: `${Math.max(8, (bar.value / Math.max(...dash.data.stats.weekday.map((item) => item.value), 1)) * maxBar)}px` }" />
              <span :class="{ best: bar.best }">{{ bar.name }}</span>
            </div>
          </div>
        </article>
        <Heatmap title="Активность за 14 недель" aside="те же недели, что на главной" :columns="dash.data.stats.heat" />
      </section>
      <h2 class="block-title">Достижения</h2>
      <Awards :awards="dash.data.stats.awards" />
    </main>
  </Shell>
</template>
