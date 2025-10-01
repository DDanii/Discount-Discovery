<script setup lang="ts">

defineProps<{
  state: boolean
}>()

defineEmits(['change'])

</script>
<template>
    <div class="m-2">
        <button class="bg-black p-1 w-full flex place-content-around border-2 border-green-600 rounded-xl" @click="$emit('change', !state )">
            <IconTick :is-filled="state" class="border-2 border-green-600 rounded-xl"/> 
            <div class="h-auto ml-2 border-2 border-green-600 mr-2"/>
            <div class="mr-auto ml-auto flex">
                <slot />
            </div>
        </button>
    </div>
</template>