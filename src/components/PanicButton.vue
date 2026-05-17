<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-black">
    <p class="text-gray-500 text-sm mb-4 tracking-widest uppercase">TraderCalm</p>
    <h1 class="text-2xl md:text-3xl font-light text-gray-300 mb-12 leading-relaxed">
      你还好吗？<br />
      <span class="text-gray-400">是不是有点上头了？</span>
    </h1>
    <button
      @click="$emit('panic')"
      class="animate-pulse-glow w-72 h-72 md:w-80 md:h-80 rounded-full bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xl md:text-2xl font-bold leading-snug transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none"
    >
      我上头了，<br />帮我踩刹车
    </button>
    <p class="mt-12 text-gray-600 text-sm max-w-md">
      点击按钮，进入 60 秒强制冷静期。<br />这 60 秒可能拯救你今天的账户。
    </p>
  </div>
</template>

<script setup>
defineEmits(['panic'])
</script>
