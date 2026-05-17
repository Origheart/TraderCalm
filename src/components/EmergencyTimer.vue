<template>
  <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black select-none overflow-hidden">
    <!-- 呼吸圆 + 倒计时（居中） -->
    <div class="relative flex items-center justify-center mb-16 md:mb-20">
      <div class="animate-breathe w-48 h-48 md:w-64 md:h-64 rounded-full bg-red-600/20"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-8xl md:text-9xl font-bold text-red-500 tabular-nums leading-none">
          {{ seconds }}
        </div>
      </div>
    </div>

    <!-- 毒鸡汤（呼吸圆下方） -->
    <div class="px-6 max-w-md text-center">
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
