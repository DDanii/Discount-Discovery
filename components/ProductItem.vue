<script setup lang="ts">
import type ProductWithPreference from "@@/utils/types/productWithPreference"

defineProps<{
  product: ProductWithPreference
}>()

defineEmits(['preference-change'])
</script>

<template>
  <div class="w-64 min-h-fit border-2 rounded-xl border-green-600 m-2 flex flex-col overflow-hidden">
    <div class="w-full max-h-64">
      <img :src="product.image ?? ''" class="max-w-60 rounded-xl m-auto mt-1">
    </div>

    <h3 class="text-green-500 text-sm text-center mt-auto">{{ product.name }}</h3>
    <h3 v-if="product.price != -1" class="text-green-500 text-sm text-center">{{ product.price }}</h3>
    <div class="flex place-content-around">
      <button class="p-1 border-t-2 border-r-2 border-green-600 w-full flex place-content-center" @click="$emit('preference-change', {value: true} )">
        <IconTick :is-filled="product.preference === true" />
      </button>
      <button class="p-1 border-t-2 border-l-2 border-green-600 w-full flex place-content-center" @click="$emit('preference-change', {value: false})">
        <IconCross :is-filled="product.preference === false" />
      </button> 
    </div>
  </div>
</template>
