<script setup lang="ts">
import ProductItem from '../components/ProductItem.vue'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import type { product } from '../../types/product'


defineProps({
  showFavorites: Boolean,
  showUncategorised: Boolean,
  showDisliked: Boolean,
})

const products = ref([] as product[])




onMounted(async () => {
  axios.get('/products')
  .then(function (response) {
    console.log(response)
  })

})
</script>

<template>
  <main>
    <ProductItem v-for="product in products" :image="product.image" :key="product.name">
    </ProductItem>
  </main>
</template>
