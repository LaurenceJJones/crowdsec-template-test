<script setup>
  import mainInput from './components/mainInput.vue'
  import { SimpleBar } from 'simplebar-vue3';
  import {
    ref,
    inject,
  } from 'vue'
  let dataView = ref("")
  const formatWrapper = inject("formatWrapper")
</script>

<template>
<main-input @format="(t) => dataView = formatWrapper(t)" />    
<SimpleBar class="overflow-x-wrap h-5/6">
  <code class="whitespace-pre-line">{{ dataView }}</code>
</SimpleBar>
</template>