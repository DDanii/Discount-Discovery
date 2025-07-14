<script setup lang="ts">
defineProps({
  image: {type: String, default: ""},
  price: {type: Number, default: -1},
  name: {type: String, default: ""}
})
</script>

<template>
    <div class="w-64 min-h-fit border-2 rounded-xl border-green-600 m-2 p-1">
      <div class="w-full h-64">
        <img :src="image" class="max-w-60 rounded-xl m-auto">
      </div>
      
      <h3 class="text-green-500 text-sm text-center">{{ name }}</h3>
      <h3 v-if="price != -1" class="text-green-500 text-sm text-center">{{ price }}</h3>
    </div>
</template>
