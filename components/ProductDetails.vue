<script setup lang="ts">
import { ShopDB } from "~/database/database";
import type { ProductWithPreferences } from "~/utils/types/product"

const props = defineProps<{
  product: ProductWithPreferences
}>()

const shopDB = new ShopDB()
const shop = (await shopDB.get(props.product.shopId))

</script>
<template>

  <div class="flex flex-col m-auto w-fit h-fit max-w-full max-h-full mt-auto bg-black rounded-xl  border-2 p-2">
    <div class="flex">
      <img :src="shop.icon ?? ''" class="w-8" :class="{ ['invisible']: !shop.icon }" />
      <h3 class="m-auto">{{ shop.name }}</h3>
      <icon-cross />
    </div>
    <img :src="product.image ?? ''" class="mt-2 mb-2 m-auto h-full w-min max-h-full max-w-full rounded-xl">

    <h3 class="m-auto">{{ product.name }}</h3>
    <h3 class="m-auto">{{ product.price }}</h3>
    <h3 class="m-auto">{{ product.category }}</h3>
    <h3 class="m-auto">
      {{ new Date(product.startDate).toDateString() }} - {{ new Date(product.endDate).toDateString() }}
    </h3>
  </div>
</template>