<script setup>
  import mainInput from './components/mainInput.vue'
  import {
    ref,
    inject
  } from 'vue'
  let dataView = ref("")
  const formatWrapper = inject("formatWrapper")
</script>

<template>
  <div class="dark h-screen">
    <div class="dark:bg-slate-800 dark:text-white h-full">
      <div class="flex flex-col h-full">
        <main-input @fetchFormat="(t) => dataView = formatWrapper(t)" />
        <div class="w-screen overflow-y-scroll flex-1 overflow-x-wrap">
          <code class="whitespace-pre-line">{{ dataView }}</code>
        </div>
      </div>
    </div>
  </div>
</template>