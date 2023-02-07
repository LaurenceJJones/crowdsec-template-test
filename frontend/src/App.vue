<script setup>
  import mainInput from './components/mainInput.vue'
  import {
    ref,
    inject,
    watch,
    provide
  } from 'vue'
  let dataView = ref("")
  const formatWrapper = inject("formatWrapper")
  const errorMessage = ref("")
  provide("setError", (t) => {
    errorMessage.value = t
  })
  watch(errorMessage, (currentValue) => {
    if (currentValue !== "") {
      setTimeout(() => {
        errorMessage.value = ""
      }, 3000)
    }
  })
</script>

<template>
  <div class="h-screen text-white">
    <div class="flex flex-col">
      <main-input @format="(t) => dataView = formatWrapper(t)" @error="(t) => errorMessage = t" />
      <div class="w-screen overflow-y-scroll flex-1 overflow-x-wrap">
        <code class="whitespace-pre-line">{{ dataView }}</code>
      </div>
    </div>
    <div class="fixed bottom-0 right-0 m-4" v-if="errorMessage">
      <div class="bg-red-500 px-4 py-2 rounded-xl">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>