<template>
  <div class="fixed inset-0 z-50 bg-black select-none overflow-hidden">
    <!-- 呼吸圆背景（绝对定位，缩放不影响布局） -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="animate-breathe w-72 h-72 md:w-96 md:h-96 rounded-full bg-red-600/20"></div>
    </div>

    <!-- 倒计时（绝对定位于屏幕上部，永不移动） -->
    <div class="absolute inset-x-0 text-center" style="top: 30%">
      <div class="text-8xl md:text-9xl font-bold text-red-500 tabular-nums leading-none">
        {{ seconds }}
      </div>
    </div>

    <!-- 毒鸡汤（绝对定位于倒计时下方，永不移动） -->
    <div class="absolute inset-x-0 px-6 text-center" style="top: 52%">
      <div class="max-w-lg mx-auto">
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
