<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center">
    <div class="mb-8 w-16 h-16 rounded-full bg-emerald-600/20 flex items-center justify-center">
      <span class="text-3xl">🧘</span>
    </div>

    <p class="text-gray-500 text-sm mb-2">冷静期结束</p>
    <h1 class="text-2xl md:text-3xl font-light text-gray-200 mb-8">好一点了吗？</h1>

    <div class="max-w-lg bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 animate-fade-in">
      <p class="text-gray-300 text-lg md:text-xl leading-relaxed">
        {{ quote.text }}
      </p>
    </div>

    <div class="flex flex-col sm:flex-row gap-4">
      <button
        @click="copyQuote"
        class="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-medium transition-all duration-200 focus:outline-none"
      >
        {{ copied ? '✅ 已复制！' : '📋 一键复制此金句，发到交易群' }}
      </button>
      <button
        @click="$emit('reset')"
        class="px-8 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-xl font-medium transition-all duration-200 focus:outline-none"
      >
        再来一次
      </button>
    </div>

    <!-- 自动复制的 textarea（不可见） -->
    <textarea ref="copyTextarea" class="absolute opacity-0 pointer-events-none" readonly :value="copyContent"></textarea>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getRandomQuote } from '../data/quotes.js'

defineEmits(['reset'])

const quote = ref(getRandomQuote('calm'))
const copied = ref(false)
const copyTextarea = ref(null)

const copyContent = computed(() => {
  return `【TraderCalm 冷静金句】\n${quote.value.text}\n\n——来自 TraderCalm 交易员情绪急救包`
})

function copyQuote() {
  if (!copyTextarea.value) return
  copyTextarea.value.value = copyContent.value
  copyTextarea.value.select()
  try {
    document.execCommand('copy')
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // fallback: 使用 navigator.clipboard
    navigator.clipboard.writeText(copyContent.value).then(() => {
      copied.value = true
      setTimeout(() => { copied.value = false }, 2000)
    })
  }
}
</script>
