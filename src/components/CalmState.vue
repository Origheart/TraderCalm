<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-black">
    <div class="mb-8 w-16 h-16 rounded-full bg-emerald-900 flex items-center justify-center">
      <span class="text-3xl font-sans">🧘</span>
    </div>

    <p class="text-gray-500 text-sm mb-2 font-sans">{{ msg.calmEnd }}</p>
    <h1 class="text-2xl md:text-3xl font-light text-gray-200 mb-8 font-serif">{{ msg.calmQuestion }}</h1>

    <div class="max-w-lg bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 animate-fade-in">
      <p class="text-gray-300 text-lg md:text-xl leading-relaxed font-sans">
        {{ quote.text }}
      </p>
    </div>

    <!-- 分享区 -->
    <div class="w-full max-w-sm">
      <p class="text-gray-600 text-xs mb-3 font-sans">{{ msg.shareLabel }}</p>
      <div class="flex flex-col gap-2.5">
        <button
          @click="copyQuote"
          class="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-gray-800 hover:bg-gray-700 border border-gray-700/50 hover:border-gray-600 text-gray-200 rounded-xl font-medium transition-all duration-200 focus:outline-none group font-sans"
        >
          <span class="text-lg">{{ textCopied ? '✅' : '📋' }}</span>
          <span>{{ textCopied ? msg.copiedText : msg.copyText }}</span>
          <span class="text-gray-600 text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
        </button>
        <button
          @click="copyImage"
          :disabled="imageLoading"
          class="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-gray-800 hover:bg-gray-700 border border-gray-700/50 hover:border-gray-600 text-gray-200 rounded-xl font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 group font-sans"
        >
          <span class="text-lg">{{ imageCopied ? '✅' : imageLoading ? '⏳' : '🖼️' }}</span>
          <span>{{ imageCopied ? msg.copiedImage : imageLoading ? msg.generating : msg.copyImage }}</span>
          <span class="text-gray-600 text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
        </button>
      </div>
      <button
        @click="$emit('reset')"
        class="mt-5 text-sm text-gray-600 hover:text-gray-400 transition-colors font-sans"
      >
        {{ msg.resetButton }}
      </button>
    </div>

    <textarea ref="copyTextarea" class="absolute opacity-0 pointer-events-none" readonly></textarea>
    <canvas ref="canvasEl" class="hidden"></canvas>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { messages } from '../i18n.js'
import { getRandomQuote } from '../data/quotes.js'

const props = defineProps(['locale'])
defineEmits(['reset'])

const msg = computed(() => messages[props.locale])
const isZh = computed(() => props.locale === 'zh')

const quote = ref(getRandomQuote(props.locale, 'calm'))
const textCopied = ref(false)
const imageCopied = ref(false)
const imageLoading = ref(false)
const copyTextarea = ref(null)
const canvasEl = ref(null)

const copyContent = computed(() => {
  if (props.locale === 'zh') {
    return `【TraderCalm 冷静金句】\n${quote.value.text}\n\n——来自 TraderCalm 交易员情绪急救包\nhttps://tradercalm.vercel.app/`
  }
  return `【TraderCalm】\n${quote.value.text}\n\n—— from TraderCalm\nhttps://tradercalm.vercel.app/`
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

  // 背景
  ctx.fillStyle = '#050505'
  ctx.fillRect(0, 0, W, H)

  // 顶部/底部装饰线
  const grad = ctx.createLinearGradient(0, 0, W, 0)
  grad.addColorStop(0, 'rgba(220,38,38,0)')
  grad.addColorStop(0.3, 'rgba(220,38,38,0.15)')
  grad.addColorStop(0.7, 'rgba(220,38,38,0.15)')
  grad.addColorStop(1, 'rgba(220,38,38,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, 1)
  ctx.fillRect(0, H - 1, W, 1)

  // 品牌
  ctx.fillStyle = '#404040'
  ctx.font = isZh.value
    ? '500 12px "Noto Sans SC", sans-serif'
    : '500 12px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(isZh.value ? 'T R A D E R C A L M' : 'T R A D E R C A L M', W / 2, 52)

  // 上引号
  ctx.fillStyle = 'rgba(220,38,38,0.25)'
  ctx.font = '72px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('"', W / 2, 120)

  // 正文
  ctx.fillStyle = '#e5e5e5'
  ctx.font = isZh.value
    ? '24px "Noto Sans SC", sans-serif'
    : '22px Inter, sans-serif'
  ctx.textAlign = 'center'
  const maxWidth = W - 160
  const lineH = isZh.value ? 42 : 38
  const textEnd = wrapText(ctx, quote.value.text, W / 2, 168, maxWidth, lineH)

  // 下引号
  const afterTextY = textEnd + 8
  ctx.fillStyle = 'rgba(220,38,38,0.25)'
  ctx.font = '72px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('"', W / 2, afterTextY + 20)

  // 分隔线
  const lineY = Math.max(afterTextY + 64, 370)
  ctx.strokeStyle = '#1f1f1f'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(W / 2 - 120, lineY)
  ctx.lineTo(W / 2 + 120, lineY)
  ctx.stroke()

  // 链接
  ctx.fillStyle = '#525252'
  ctx.font = isZh.value
    ? '400 13px "Noto Sans SC", sans-serif'
    : '400 13px Inter, sans-serif'
  ctx.textAlign = 'center'
  const label = isZh.value
    ? '交易员情绪急救包 · tradercalm.vercel.app'
    : 'TraderCalm · tradercalm.vercel.app'
  ctx.fillText(label, W / 2, lineY + 28)

  // 水印
  ctx.fillStyle = '#1a1a1a'
  ctx.font = '600 11px Inter, sans-serif'
  ctx.fillText('TraderCalm', W / 2, H - 24)

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
