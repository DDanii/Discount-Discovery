<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div >

      <nav>
        <RouterLink to="/">
          <button></button>
          <button></button>
          <button></button>
        </RouterLink>
        <RouterLink to="/settings">Settings</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
  body {background-color: black;}
</style>
