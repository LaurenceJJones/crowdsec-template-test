<script setup>
  import mainInput from './components/mainInput.vue';
  import { SimpleBar } from 'simplebar-vue3';
  import { ref } from 'vue';
  const dataView = ref("");
  const modalActive = ref(false);
</script>

<template>
<main-input @format="(t) => dataView = t" @modal="(t) => modalActive = t"/>    
<SimpleBar class="overflow-x-wrap h-5/6 z-0" v-if="!modalActive">
  <code class="whitespace-pre-line z-0">
    {{ dataView }}
  </code>
</SimpleBar>
</template>
