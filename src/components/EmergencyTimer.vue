<template>
  <div class="fixed inset-0 z-50 flex flex-col bg-black select-none overflow-hidden">
    <!-- 上部分：倒计时 + 呼吸圆（flex-1 固定位置，不受文案影响） -->
    <div class="flex-1 flex flex-col items-center justify-center">
      <div class="relative flex items-center justify-center">
        <div class="animate-breathe w-36 h-36 md:w-48 md:h-48 rounded-full bg-red-600/20"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-7xl md:text-8xl font-bold text-red-500 tabular-nums leading-none">
            {{ seconds }}
          </div>
        </div>
      </div>
    </div>

    <!-- 下部分：毒鸡汤（自然高度，不影响上面布局） -->
    <div class="pb-12 md:pb-16 px-6 max-w-md mx-auto text-center">
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
