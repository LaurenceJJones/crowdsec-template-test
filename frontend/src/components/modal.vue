<template>
    <slot name="activator" :on="toggleShow"/>
    <div class="h-screen w-full fixed left-0 top-0 flex justify-center items-center bg-black bg-opacity-50 cursor-pointer" :class="{ 'hidden': show }" @click="toggleShow(false)">
        <div class="transition-transform transform duration-200 bg-slate-800 shadow-lg rounded-t-xl w-1/3 h-1/2 cursor-default" :class="animationClasses" @click.stop>
            <div class="border-b px-4 py-1 flex justify-between">
                <h2 class="capitalize text-2xl">
                    {{ title }}
                </h2>
                <button @click.stop="toggleShow(false)">
                    <font-awesome-icon icon="fa-solid fa-xmark" size="2x" />
                </button>
            </div>
            <div class="px-1 overflow-y-scroll rounded-b-xl h-full bg-slate-800 ">
                <slot>
                    No content
                </slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    ref
} from 'vue'

defineProps({
    "title": String
})
const show = ref(true)
const animationClasses = ref(['-translate-y-full', 'opacity-0'])
const toggleShow = (animation) => {
    if (animation) {
        show.value = !show.value
        setTimeout(() => animationClasses.value = [], 200) 
    } else {
        animationClasses.value.push('-translate-y-full')
        setTimeout(() => animationClasses.value.push('opacity-0'), 100)
        setTimeout(() => show.value = !show.value, 300) 
    }
}
</script>