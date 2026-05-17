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

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
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

  // ── 背景 ──
  ctx.fillStyle = '#050505'
  ctx.fillRect(0, 0, W, H)

  // 顶部/底部细微渐变线
  const grad = ctx.createLinearGradient(0, 0, W, 0)
  grad.addColorStop(0, 'rgba(220,38,38,0)')
  grad.addColorStop(0.3, 'rgba(220,38,38,0.15)')
  grad.addColorStop(0.7, 'rgba(220,38,38,0.15)')
  grad.addColorStop(1, 'rgba(220,38,38,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, 1)
  ctx.fillRect(0, H - 1, W, 1)

  // ── 品牌 ──
  ctx.fillStyle = '#404040'
  ctx.font = '500 12px -apple-system, "PingFang SC", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('T R A D E R C A L M', W / 2, 52)

  // ── 上引号 ──
  ctx.fillStyle = 'rgba(220,38,38,0.25)'
  ctx.font = '72px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('"', W / 2, 120)

  // ── 正文 ──
  ctx.fillStyle = '#e5e5e5'
  ctx.font = '24px -apple-system, "PingFang SC", "Noto Sans SC", sans-serif'
  ctx.textAlign = 'center'
  const textX = W / 2
  const maxWidth = W - 160
  const lineH = 42
  const textEnd = wrapText(ctx, quote.value.text, textX, 168, maxWidth, lineH)

  // ── 下引号 ──
  const afterTextY = textEnd + 8
  ctx.fillStyle = 'rgba(220,38,38,0.25)'
  ctx.font = '72px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('"', W / 2, afterTextY + 20)

  // ── 分隔线 ──
  const lineY = Math.max(afterTextY + 64, 370)
  ctx.strokeStyle = '#1f1f1f'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(W / 2 - 120, lineY)
  ctx.lineTo(W / 2 + 120, lineY)
  ctx.stroke()

  // ── 链接 ──
  ctx.fillStyle = '#525252'
  ctx.font = '400 13px -apple-system, "PingFang SC", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('交易员情绪急救包 · tradercalm.vercel.app', W / 2, lineY + 28)

  // ── 底部 TraderCalm 水印 ──
  ctx.fillStyle = '#1a1a1a'
  ctx.font = '600 11px -apple-system, sans-serif'
  ctx.fillText('TraderCalm', W / 2, H - 24)

  // ── 转 blob → clipboard ──
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
  if (!blob) { imageLoading.value = false; return }

  try {
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ])
    imageCopied.value = true
    setTimeout(() => { imageCopied.value = false }, 2000)
  } catch {
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
