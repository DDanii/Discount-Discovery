<script setup lang="ts">
import { useSideBarOpen } from './composable/states';

const sidebarOpen = useSideBarOpen()
</script>

<template>
  <div class="h-screen overflow-hidden flex flex-col text-green-600" style="background-color: black;">
    <nav class="flex h-14 content-center place-content-between p-1 bg-green-950 border-green-600 border-b-2">
      <button class="bg-black rounded-full border-green-600 border-2" @click="sidebarOpen = !sidebarOpen">
        <IconHamburger />
      </button>
      <div class="flex w-32 mt-auto mb-auto
        place-content-center bg-black rounded-3xl
        border-green-600 border-2 overflow-clip">

        <NuxtLink class="w-full ml-auto border-r-2 border-green-600" to="/">
          <IconPreferenceFrame class="ml-auto mr-auto">
            <div class="w-3 h-3 bg-green-300 m-0.5 content-center">
              <div class="m-auto w-2 h-2 rounded-full bg-yellow-400"/>
            </div>
          </IconPreferenceFrame>
        </NuxtLink>

        <NuxtLink class="w-full" to="/categories">
          <IconPreferenceFrame class="ml-auto mr-auto">
            <h3 class="text-xs select-none">C</h3>
          </IconPreferenceFrame>
        </NuxtLink>

      </div>
      <button class="bg-black rounded-full border-green-600 w-fit border-2 flex content-center overflow-clip">
        <NuxtLink to="/AppSettings" class="p-1 w-fit">
          <IconCog />
        </NuxtLink>
      </button>
    </nav>
    <NuxtPage />
  </div>
</template>
<style>
.router-link-exact-active {
  background-color: #052e16;
}
</style>
