<script setup lang="ts">
import { useDBLoggedIn, useDBOffline, useDBSyncing, useDBUrlIsSet, useSideBarOpen } from './composable/states';
import { DB, DBLocation, DBName } from './database/database';

const sidebarOpen = useSideBarOpen()
const dbUrlIsSet = useDBUrlIsSet()
const dbOffline = useDBOffline()
const dbSyncing = useDBSyncing()
const loggedIn = useDBLoggedIn()

let remoteDB = null as null | DB

const dbUrl = localStorage.getItem(dbRemoteUrl_name)
DB.setRemoteUrl(dbUrl)
dbUrlIsSet.value = DB.isUrlSet()
let timer: NodeJS.Timeout | null

watch([loggedIn, dbOffline], trySync)
await trySync()

async function trySync() {
  if (!DB.isUrlSet()) {
    if(timer) clearInterval(timer)
    return
  }
  remoteDB = new DB(DBLocation.remote, DBName.shop)
  if (!timer) 
    timer = setInterval(dbStatusUpdate, 60000)
  if (!await remoteDB.isRemoteLoggedIn()) {
    loggedIn.value = false
    return
  }
  DB.remoteSync()
}

function dbStatusUpdate(){
  if(remoteDB)
    remoteDB.getUserName()
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
          flex content-center overflow-clip"
          :class="{
            ['border-yellow-500']: dbUrlIsSet && dbOffline, 
            ['border-red-600']: !dbUrlIsSet || ( !dbOffline && !loggedIn ),
            ['animate-spin']: dbSyncing,
            ['border-t-green-500']: dbSyncing,
            ['border-b-green-500']: dbSyncing}">
        <NuxtLink to="/AppSettings" class="p-1 w-fit">
          <IconCog :class="{['animate-[rev-spin_1s_linear_infinite]']: dbSyncing}" />
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
