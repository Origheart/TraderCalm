import { ref, computed } from 'vue'

const locale = ref(detectLocale())

function detectLocale() {
  return (navigator.language || '').startsWith('zh') ? 'zh' : 'en'
}

export function useLocale() {
  function setLocale(l) {
    locale.value = l
  }
  return { locale, setLocale }
}

export const messages = {
  zh: {
    // PanicButton
    brand: 'TraderCalm · 交易员情绪急救包',
    headline: '账户在流血吗？',
    subHeadline: '你现在需要止血。',
    button: '！踩刹车 ！',
    symptom1: 'FOMO 上头了？看见涨就想追？',
    symptom2: '想报复性开仓，想把亏的赚回来？',
    symptom3: '管不住手了？明明计划是等，还是买了？',
    footer: '点击按钮进入 60 秒强制冷静期。\n这 60 秒可能拯救你今天的账户。',

    // EmergencyTimer
    thinkLabel: '— 冷静想想 —',

    // CalmState
    calmEnd: '冷静期结束',
    calmQuestion: '好一点了吗？',
    copyText: '📋 复制文字发群里',
    copyImage: '🖼️ 复制图片发群里',
    generating: '⏳ 生成中…',
    copiedText: '✅ 已复制文字！',
    copiedImage: '✅ 图片已复制！',
    resetButton: '再来一次',
    shareLabel: '分享到交易群 · 帮战友冷静',
    copyLabel: '【TraderCalm 冷静金句】',
    fromLabel: '——来自 TraderCalm 交易员情绪急救包',
  },

  en: {
    // PanicButton
    brand: 'TraderCalm',
    headline: 'Is your account bleeding?',
    subHeadline: 'You need to stop the bleeding.',
    button: '！HIT BRAKES ！',
    symptom1: 'FOMO kicking in? Chasing the pump?',
    symptom2: 'Revenge trading? Trying to win it back?',
    symptom3: "Can't stop? Your plan says wait, but you bought anyway?",
    footer: 'Tap for a 60-second mandatory cooldown.\nIt might save your account today.',

    // EmergencyTimer
    thinkLabel: '— Breathe —',

    // CalmState
    calmEnd: 'Cooldown complete',
    calmQuestion: 'Feeling better?',
    copyText: '📋 Copy text & share',
    copyImage: '🖼️ Copy image & share',
    generating: '⏳ Generating…',
    copiedText: '✅ Text copied!',
    copiedImage: '✅ Image copied!',
    resetButton: 'Do it again',
    shareLabel: 'Share with your group · Help a trader',
    copyLabel: '【TraderCalm】',
    fromLabel: '—— from TraderCalm',
  },
}

export function t(key) {
  return computed(() => messages[locale.value][key])
}
