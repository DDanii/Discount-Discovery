<script setup lang="ts">
const showDetails = ref(false)

defineProps<{
  preference: boolean | null
}>()

defineEmits(['preference-change'])
</script>

<template>
  <div class="w-64 min-h-fit border-2 rounded-xl  m-2 flex flex-col overflow-hidden">
    <div @click="showDetails = !showDetails">
      <slot name="content" />

    </div>
    <div class="flex place-content-around mt-auto">
      <button class="p-1 border-t-2 border-r  w-full flex place-content-center"
        @click="$emit('preference-change', { value: preference ? null : true })">
        <IconTick :is-filled="preference === true" />
      </button>
      <button class="p-1 border-t-2 border-l  w-full flex place-content-center"
        @click="$emit('preference-change', { value: preference == false ? null : false })">
        <IconCross :is-filled="preference === false" />
      </button>
    </div>
    <div v-if="showDetails" class="z-10 fixed top-0 right-0 h-full w-full flex content-center"
      @click="showDetails = false">
      <slot name="details" />
    </div>
  </div>
</template>
