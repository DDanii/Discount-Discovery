<script setup lang="ts">
import { useDBLoggedIn, useSideBarOpen } from './composable/states';
import { dbRemoteUrl_name } from './utils/constants';
import { DB, DBLocation, DBName } from './database/database';

const sidebarOpen = useSideBarOpen()

DB.setRemoteUrl(localStorage.getItem(dbRemoteUrl_name))

const loggedIn = useDBLoggedIn()
watch(loggedIn, trySync)
await trySync()

async function trySync() {
  if (!DB.urlIsSet()) return
  const remoteDB = new DB(DBLocation.remote, DBName.shop)
  if (!await remoteDB.remoteIsLoggedIn()) {
    loggedIn.value = false
    return
  }
  DB.remoteSync()
}

</script>
<template>
  <div class="h-screen overflow-hidden flex flex-col text-green-600" style="background-color: black;">
    <nav class="flex h-14 content-center place-content-between p-1 bg-green-950  border-b-2">
      <button class="bg-black rounded-full  border-2" @click="sidebarOpen = !sidebarOpen">
        <IconHamburger />
      </button>
      <div class="flex w-32 mt-auto mb-auto
        place-content-center bg-black rounded-3xl
         border-2 overflow-clip">

        <NuxtLink class="w-full ml-auto border-r-2 " to="./">
          <IconProductPreference />
        </NuxtLink>

        <NuxtLink class="w-full" to="./categories">
          <IconCategoryPreference />
        </NuxtLink>

      </div>
      <button class="bg-black rounded-full  w-fit border-2 
          flex content-center overflow-clip">
        <NuxtLink to="/AppSettings" class="p-1 w-fit">
          <IconCog />
        </NuxtLink>
      </button>
    </nav>
    <NuxtPwaAssets />
    <NuxtPage />
  </div>
</template>
<style>
.router-link-exact-active {
  background-color: #052e16;
}
</style>
