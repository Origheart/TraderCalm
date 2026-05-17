<template>
  <div class="fixed inset-0 z-50 bg-black overflow-hidden">
    <!-- 呼吸圆 + 倒计时 -->
    <div class="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 circle-center">
      <div class="relative flex items-center justify-center font-sans">
        <div class="animate-breathe w-64 h-64 md:w-80 md:h-80 rounded-full bg-red-600/30"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-8xl md:text-9xl font-bold text-red-500 tabular-nums leading-none font-sans">
            {{ seconds }}
          </div>
        </div>
      </div>
    </div>

    <!-- 毒鸡汤：固定在圆下方 -->
    <div class="absolute inset-x-0 px-2 md:px-6 text-center quote-pos">
      <div class="max-w-md md:max-w-lg mx-auto">
        <p class="text-gray-500 text-xs tracking-widest mb-4 font-sans">{{ msg.thinkLabel }}</p>
        <transition name="fade" mode="out-in">
          <p
            :key="currentQuote.text"
            class="text-xl md:text-2xl font-bold text-red-300/90 leading-relaxed animate-fade-in font-sans"
          >
            {{ currentQuote.text }}
          </p>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { messages } from '../i18n.js'
import { getRandomQuote } from '../data/quotes.js'

const props = defineProps(['locale'])
const emit = defineEmits(['done'])

const msg = computed(() => messages[props.locale])

const seconds = ref(60)
const currentQuote = ref(getRandomQuote(props.locale, 'toxic'))

let timer = null
let quoteTimer = null

function cycleQuote() {
  currentQuote.value = getRandomQuote(props.locale, 'toxic')
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

/* 移动端上移，桌面端居中 */
.circle-center {
  top: 38%;
}
.quote-pos {
  top: calc(38% + 190px);
}
@media (min-width: 768px) {
  .circle-center {
    top: 50%;
  }
  .quote-pos {
    top: calc(50% + 260px);
  }
}
</style>
