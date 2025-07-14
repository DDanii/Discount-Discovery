

<script setup lang="ts">
import ProductItem from '~/components/ProductItem.vue';

const { data } = await useFetch('/api/products/list')



// const props = defineProps({
//   showFavorites: Boolean,
//   showUncategorised: Boolean,
//   showDisliked: Boolean,
// })

</script>

<template>
  <div v-if="data == null">
    No data
  </div>
  <div v-else class="flex flex-wrap place-content-evenly">
    <ProductItem
      v-for="product in data?.productList"
      :key="product.id"
      :image="product.image"
      :name="product.name"
      :price="product.price"
    />
  </div>
</template>
