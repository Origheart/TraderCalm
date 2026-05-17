<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-black">
    <!-- 顶部标志 -->
    <p class="text-gray-600 text-xs mb-8 tracking-widest uppercase">TraderCalm · 交易员情绪急救包</p>

    <!-- 主标题 -->
    <h1 class="text-4xl md:text-5xl font-black text-red-400 leading-tight mb-3">
      账户在流血吗？
    </h1>
    <p class="text-lg md:text-xl text-gray-400 mb-10 font-medium">
      你现在需要止血。
    </p>

    <!-- 制动按钮 -->
    <button
      @click="$emit('panic')"
      class="animate-pulse-glow w-full max-w-xs py-5 md:py-6 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xl md:text-2xl font-bold rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-95 focus:outline-none shadow-2xl shadow-red-600/30"
    >
      ！踩刹车 ！
    </button>

    <!-- 症状自查清单 -->
    <div class="mt-10 space-y-3 text-left">
      <div class="flex items-center gap-3 text-gray-500">
        <span class="text-red-600/60 text-lg">▸</span>
        <span class="text-sm md:text-base">FOMO 上头了？看见涨就想追？</span>
      </div>
      <div class="flex items-center gap-3 text-gray-500">
        <span class="text-red-600/60 text-lg">▸</span>
        <span class="text-sm md:text-base">想报复性开仓，想把亏的赚回来？</span>
      </div>
      <div class="flex items-center gap-3 text-gray-500">
        <span class="text-red-600/60 text-lg">▸</span>
        <span class="text-sm md:text-base">管不住手了？明明计划是等，还是点了买入？</span>
      </div>
    </div>

    <!-- 底部提示 -->
    <p class="mt-10 text-gray-600 text-xs max-w-xs leading-relaxed">
      点击按钮进入 60 秒强制冷静期。<br />这 60 秒可能拯救你今天的账户。
    </p>
  </div>
</template>

<script setup>
defineEmits(['panic'])
</script>
