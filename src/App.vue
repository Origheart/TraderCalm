<template>
  <PanicButton v-if="state === 'idle'" @panic="triggerPanic" />
  <EmergencyTimer v-else-if="state === 'emergency'" @done="onCalm" />
  <CalmState v-else @reset="reset" />
</template>

<script setup>
import { ref } from 'vue'
import PanicButton from './components/PanicButton.vue'
import EmergencyTimer from './components/EmergencyTimer.vue'
import CalmState from './components/CalmState.vue'

// 简单状态机：idle → emergency → calm → idle
const state = ref('idle')

function triggerPanic() {
  state.value = 'emergency'
}

function onCalm() {
  state.value = 'calm'
}

function reset() {
  state.value = 'idle'
}
</script>
