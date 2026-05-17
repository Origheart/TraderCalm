<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-black">
    <div class="mb-8 w-16 h-16 rounded-full bg-emerald-900 flex items-center justify-center">
      <span class="text-3xl">🧘</span>
    </div>

    <p class="text-gray-500 text-sm mb-2">冷静期结束</p>
    <h1 class="text-2xl md:text-3xl font-light text-gray-200 mb-8">好一点了吗？</h1>

    <div class="max-w-lg bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 animate-fade-in">
      <p class="text-gray-300 text-lg md:text-xl leading-relaxed">
        {{ quote.text }}
      </p>
    </div>

    <div class="flex flex-col gap-3">
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          @click="copyQuote"
          class="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-medium transition-all duration-200 focus:outline-none"
        >
          {{ textCopied ? '✅ 已复制文字！' : '📋 复制文字' }}
        </button>
        <button
          @click="copyImage"
          :disabled="imageLoading"
          class="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-medium transition-all duration-200 focus:outline-none disabled:opacity-50"
        >
          {{ imageCopied ? '✅ 图片已复制！' : imageLoading ? '⏳ 生成中…' : '🖼️ 复制图片' }}
        </button>
        <button
          @click="$emit('reset')"
          class="px-6 py-3 bg-red-900 hover:bg-red-800 text-red-300 rounded-xl font-medium transition-all duration-200 focus:outline-none"
        >
          再来一次
        </button>
      </div>
    </div>

    <!-- 隐藏元素 -->
    <textarea ref="copyTextarea" class="absolute opacity-0 pointer-events-none" readonly></textarea>
    <canvas ref="canvasEl" class="hidden"></canvas>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getRandomQuote } from '../data/quotes.js'

defineEmits(['reset'])

const quote = ref(getRandomQuote('calm'))
const textCopied = ref(false)
const imageCopied = ref(false)
const imageLoading = ref(false)
const copyTextarea = ref(null)
const canvasEl = ref(null)

const copyContent = computed(() => {
  return `【TraderCalm 冷静金句】\n${quote.value.text}\n\n——来自 TraderCalm 交易员情绪急救包\nhttps://tradercalm.vercel.app/`
})

function copyQuote() {
  if (!copyTextarea.value) return
  copyTextarea.value.value = copyContent.value
  copyTextarea.value.select()
  navigator.clipboard.writeText(copyContent.value).then(() => {
    textCopied.value = true
    setTimeout(() => { textCopied.value = false }, 2000)
  })
}

function formatText(ctx, text, x, y, maxWidth, lineHeight) {
  const chars = text.split('')
  let line = ''
  let ly = y
  for (const ch of chars) {
    const test = line + ch
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, ly)
      line = ch
      ly += lineHeight
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, ly)
  return ly + lineHeight
}

async function copyImage() {
  if (imageLoading.value) return
  imageLoading.value = true

  const canvas = canvasEl.value
  if (!canvas) return

  const W = 800
  const H = 500
  canvas.width = W
  canvas.height = H

  const ctx = canvas.getContext('2d')

  // 背景
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, W, H)

  // 左侧红色装饰线
  ctx.fillStyle = '#dc2626'
  ctx.fillRect(40, 60, 4, H - 120)

  // 品牌
  ctx.fillStyle = '#525252'
  ctx.font = '600 14px -apple-system, "PingFang SC", "Noto Sans SC", sans-serif'
  ctx.fillText('TRADERCALM', 64, 90)

  // 引号装饰
  ctx.fillStyle = '#dc2626'
  ctx.font = 'bold 48px serif'
  ctx.fillText('"', 64, 170)

  // 正文（自动换行）
  ctx.fillStyle = '#f0f0f0'
  ctx.font = '24px -apple-system, "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif'
  const lineHeight = 40
  const maxWidth = W - 128
  formatText(ctx, quote.value.text, 64, 205, maxWidth, lineHeight)

  // 分隔线
  const y = 380
  ctx.strokeStyle = '#262626'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(64, y)
  ctx.lineTo(W - 64, y)
  ctx.stroke()

  // 链接
  ctx.fillStyle = '#525252'
  ctx.font = '400 14px -apple-system, "PingFang SC", sans-serif'
  ctx.fillText('交易员情绪急救包 · https://tradercalm.vercel.app/', 64, y + 30)

  // 转 blob → clipboard
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
  if (!blob) { imageLoading.value = false; return }

  try {
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ])
    imageCopied.value = true
    setTimeout(() => { imageCopied.value = false }, 2000)
  } catch {
    // fallback: 下载图片
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tradercalm-quote.png'
    a.click()
    URL.revokeObjectURL(url)
    imageCopied.value = true
    setTimeout(() => { imageCopied.value = false }, 2000)
  }

  imageLoading.value = false
}
</script>
