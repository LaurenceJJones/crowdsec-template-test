<script setup>
  import mainInput from './components/mainInput.vue'
  import { SimpleBar } from 'simplebar-vue3';
  import {
    ref,
  } from 'vue'
  const dataView = ref("")
</script>

<template>
<main-input @format="(t) => dataView = t" />    
<SimpleBar class="overflow-x-wrap h-5/6">
  <code class="whitespace-pre-line">
    {{ dataView }}
  </code>
</SimpleBar>
</template>