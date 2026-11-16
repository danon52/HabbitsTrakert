<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  aside: String,
  columns: { type: Array, default: () => [] },
  panel: { type: Boolean, default: true },
})
const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
const labels = ['Пн', '', 'Ср', '', 'Пт', '', '']
const monthMarks = computed(() => {
  if (props.columns.length < 32) return []
  let prev = ''
  const marks = []
  props.columns.forEach((column, index) => {
    const key = column.start.slice(0, 7)
    if (key !== prev) {
      marks.push({ index, name: months[Number(column.start.slice(5, 7)) - 1] })
      prev = key
    }
  })
  return marks
})
const colors = ['var(--heat-0)', 'var(--heat-1)', 'var(--heat-2)', 'var(--heat-3)', 'var(--heat-4)']
</script>

<template>
  <section class="heat" :class="{ panel }">
    <header>
      <h2>{{ title }}</h2>
      <span v-if="aside" class="kicker">{{ aside }}</span>
    </header>
    <div v-if="monthMarks.length" class="months">
      <span v-for="mark in monthMarks" :key="mark.index" :style="{ left: `${26 + mark.index * 20}px` }">{{ mark.name }}</span>
    </div>
    <div class="heat-board">
      <div class="heat-labels">
        <span v-for="(label, index) in labels" :key="index">{{ label }}</span>
      </div>
      <div v-for="column in columns" :key="column.start" class="heat-col">
        <i v-for="(level, index) in column.levels" :key="index" class="cell" :style="{ background: colors[level] }" />
      </div>
    </div>
    <div class="legend-row">
      <div class="legend">
        Меньше
        <i v-for="color in colors" :key="color" class="cell" :style="{ background: color }" />
        Больше
      </div>
    </div>
  </section>
</template>
