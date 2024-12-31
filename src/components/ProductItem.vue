<script setup lang="ts">
defineProps({
  image: String,
  price: Number,
  name: String
})
</script>
<template>
  <img :src="image"/>
  <h3>{{ name }}</h3>
</template>
