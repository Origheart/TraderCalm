<template>
  <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950 select-none overflow-hidden">
    <!-- 呼吸圆背景 -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="animate-breathe w-64 h-64 md:w-96 md:h-96 rounded-full bg-red-600/10"></div>
    </div>

    <!-- 内容区：倒计时 + 毒鸡汤 -->
    <div class="relative z-10 flex flex-col items-center gap-6 md:gap-8 px-6">
      <div class="text-center">
        <div class="text-8xl md:text-9xl font-bold text-red-500 tabular-nums leading-none">
          {{ seconds }}
        </div>
      </div>

      <div class="max-w-md text-center">
        <p class="text-gray-500 text-xs tracking-widest mb-3">— 冷静想想 —</p>
        <transition name="fade" mode="out-in">
          <p
            :key="currentQuote.text"
            class="text-xl md:text-2xl font-bold text-red-300/90 leading-relaxed animate-fade-in"
          >
            {{ currentQuote.text }}
          </p>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getRandomQuote } from '../data/quotes.js'

const emit = defineEmits(['done'])

const seconds = ref(60)
const currentQuote = ref(getRandomQuote('toxic'))

let timer = null
let quoteTimer = null

function cycleQuote() {
  currentQuote.value = getRandomQuote('toxic')
}

onMounted(() => {
  timer = setInterval(() => {
    seconds.value--
    if (seconds.value <= 0) {
      clearInterval(timer)
      clearInterval(quoteTimer)
      emit('done')
    }
  }, 1000)

  quoteTimer = setInterval(cycleQuote, 6000)
})

onUnmounted(() => {
  clearInterval(timer)
  clearInterval(quoteTimer)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
