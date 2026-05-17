<template>
  <PanicButton v-if="state === 'idle'" :locale="locale" @panic="triggerPanic" />
  <EmergencyTimer v-else-if="state === 'emergency'" :locale="locale" @done="onCalm" />
  <CalmState v-else :locale="locale" @reset="reset" />
</template>

<script setup>
import { ref } from 'vue'
import { useLocale } from './i18n.js'
import PanicButton from './components/PanicButton.vue'
import EmergencyTimer from './components/EmergencyTimer.vue'
import CalmState from './components/CalmState.vue'

const { locale } = useLocale()
const state = ref('idle')

function triggerPanic() {
  // 点击按钮时触发 Umami 事件
  if (window.umami) umami.track('panic-click')
  state.value = 'emergency'
}

function onCalm() {
  state.value = 'calm'
}

function reset() {
  state.value = 'idle'
}
</script>
