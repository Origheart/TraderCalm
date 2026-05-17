<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-black">
    <p class="text-gray-600 text-xs mb-8 tracking-widest uppercase font-sans">{{ msg.brand }}</p>

    <h1 class="text-4xl md:text-5xl font-black text-red-400 leading-tight mb-3 font-serif">
      {{ msg.headline }}
    </h1>
    <p class="text-lg md:text-xl text-gray-400 mb-10 font-medium font-sans">
      {{ msg.subHeadline }}
    </p>

    <button
      @click="$emit('panic')"
      class="animate-pulse-glow w-full max-w-xs py-5 md:py-6 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xl md:text-2xl font-bold rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-95 focus:outline-none shadow-2xl shadow-red-600/30 font-sans"
    >
      {{ msg.button }}
    </button>

    <div class="mt-10 space-y-3 text-left">
      <div v-for="(item, i) in symptoms" :key="i" class="flex items-center gap-3 text-gray-500">
        <span class="text-red-600/60 text-lg">▸</span>
        <span class="text-sm md:text-base font-sans">{{ item }}</span>
      </div>
    </div>

    <p class="mt-10 text-gray-600 text-xs max-w-xs leading-relaxed font-sans" style="white-space:pre-line">
      {{ msg.footer }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { messages } from '../i18n.js'

const props = defineProps(['locale'])
defineEmits(['panic'])

const msg = computed(() => messages[props.locale])

const symptoms = computed(() => [
  msg.value.symptom1,
  msg.value.symptom2,
  msg.value.symptom3,
])
</script>
