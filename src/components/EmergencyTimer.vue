<template>
  <div class="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gray-950 select-none overflow-hidden py-12 md:py-16">
    <!-- 顶部：倒计时 -->
    <div class="text-center">
      <div class="text-7xl md:text-8xl font-bold text-red-500 tabular-nums leading-none mb-2">
        {{ seconds }}
      </div>
      <p class="text-gray-500 text-xs tracking-widest">SECONDS</p>
    </div>

    <!-- 中部：呼吸圆 -->
    <div class="flex items-center justify-center">
      <div class="animate-breathe w-48 h-48 md:w-64 md:h-64 rounded-full bg-red-600/10"></div>
    </div>

    <!-- 下部：毒鸡汤 -->
    <div class="px-6 max-w-lg mx-auto text-center">
      <p class="text-gray-500 text-xs tracking-widest mb-4">— 冷静想想 —</p>
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
