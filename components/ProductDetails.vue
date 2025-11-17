<script setup lang="ts">
import type ProductWithPreference from "@@/utils/types/productWithPreference"

defineProps<{
  product: ProductWithPreference
}>()
</script>
<template>

  <div
    class="flex flex-col m-auto w-fit h-fit max-w-full max-h-full mt-auto bg-black rounded-xl border-green-600 border-2 p-2">
    <div class="flex">
      <icon-cross class="invisible" />
      <h3 class="m-auto">{{ product.name }}</h3>
      <icon-cross />
    </div>
    <img :src="product.image ?? ''" class="mt-2 mb-2 m-auto h-full w-min max-h-full max-w-full rounded-xl">
    <div class="m-auto">
      <img :src="product.shop.icon ?? ''" />
      <h3>{{ product.shop.name }}</h3>
    </div>
    <h3 class="m-auto">{{ product.category }}</h3>
    <h3 class="m-auto">{{ product.price }}</h3>
    <h3 class="m-auto">{{ product.startDate }} - {{ product.endDate }}</h3>
  </div>
</template>