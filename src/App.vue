<template>
  <!-- 语言切换按钮：方便测试，切换后自动消失 -->
  <button
    v-if="showLangSwitch"
    @click="toggleLanguage"
    class="fixed top-4 right-4 z-[100] px-3 py-1.5 text-xs text-gray-600 hover:text-gray-400 bg-gray-900/80 hover:bg-gray-800 border border-gray-800 rounded-lg transition-all duration-200 font-sans"
  >
    {{ locale === 'zh' ? 'EN' : '中文' }}
  </button>

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

const { locale, setLocale } = useLocale()
const state = ref('idle')
const showLangSwitch = ref(true)

function toggleLanguage() {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
  showLangSwitch.value = false
}

function triggerPanic() {
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
