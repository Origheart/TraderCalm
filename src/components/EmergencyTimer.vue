<template>
  <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950 select-none">
    <!-- 呼吸圆 -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="animate-breathe w-64 h-64 md:w-96 md:h-96 rounded-full bg-red-600/10"></div>
    </div>

    <!-- 倒计时 -->
    <div class="relative z-10 text-center">
      <div class="text-8xl md:text-9xl font-bold text-red-500 tabular-nums mb-4">
        {{ seconds }}
      </div>
      <p class="text-gray-500 text-sm">深呼吸，跟着圆圈节奏</p>
    </div>

    <!-- 毒鸡汤区 -->
    <div class="absolute bottom-20 left-4 right-4 md:left-auto md:right-auto md:max-w-lg mx-auto text-center">
      <transition name="fade" mode="out-in">
        <p :key="currentQuote.text" class="text-gray-400 text-sm md:text-base leading-relaxed animate-fade-in">
          {{ currentQuote.text }}
        </p>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
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
