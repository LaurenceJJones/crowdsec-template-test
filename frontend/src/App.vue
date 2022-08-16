<script setup>
  import mainInput from './components/mainInput.vue'
  import {
    ref
  } from 'vue'
  import {
    fetchFormat
  } from './hooks'
  let dataView = ref("")
</script>

<template>
  <div class="dark h-screen">
    <div class="dark:bg-slate-800 dark:text-white h-full">
      <div class="flex flex-col h-full">
        <main-input @fetchFormat="async (t) => dataView = await fetchFormat(t)" />
        <div class="w-screen overflow-y-scroll flex-1 overflow-x-wrap">
          <code class="whitespace-pre-line">{{ dataView }}</code>
        </div>
      </div>
    </div>
  </div>
</template>