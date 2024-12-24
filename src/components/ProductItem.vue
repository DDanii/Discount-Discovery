<script setup lang="ts">
defineProps({
  image: String,
  price: Number,
})
</script>
<template>
  <img :src="image"/>
</template>
