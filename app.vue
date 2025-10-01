<script setup lang="ts">
import { useSideBarOpen } from './composable/states';

const sidebarOpen = useSideBarOpen()
</script>

<template>
  <div class="h-screen overflow-hidden flex flex-col bg-black text-green-600">
    <nav class="flex h-14 content-center place-content-between p-1 bg-green-950 border-green-600 border-b-2">
      <button class="bg-black rounded-full border-green-600 border-2" @click="sidebarOpen = !sidebarOpen">
        <IconHamburger />
      </button>
      <NuxtLink class="flex place-content-center w-fit bg-black rounded-full mt-auto mb-auto border-green-600 border-2" to="/">
        <img src="./icon.png" class="h-11">
      </NuxtLink>
      <NuxtLink to="/AppSettings" class="flex content-center">
        <button class="p-1 bg-black rounded-full border-green-600 border-2"> 
          <IconCog /> 
        </button>
      </NuxtLink>
    </nav>
    <NuxtPage />
  </div>
</template>
