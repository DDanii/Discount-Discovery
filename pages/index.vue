<script setup lang="ts">
import { useListQuery, useSideBarOpen } from '~/composable/states';

const sidebarOpen = useSideBarOpen()
const query = useListQuery()
const { data } = useFetch('/api/products/list',{query: query})

async function setPreference(id: number, value: boolean) {
  await $fetch("/api/products/preference", {
    method: "POST",
    body: { productId: id, value: value }
  }).then(() => {
      query.value.counter ++
  }).catch((error) => {
    console.error("Error updating preference:", error);
  });
}
</script>

<template>
  <div class="flex flex-wrap h-full w-full overflow-hidden">
    <div :class="{['collapse']: !sidebarOpen}" class="w-full min-w-fit h-full flex place-content-center flex-shrink-0 basis-0 flex-grow bg-green-950 border-r-2 border-green-600">
      <SideBar/>
    </div>
    <div class="w-80 h-full overflow-y-auto" style="flex-grow:100; scrollbar-color:rgb(22 163 74 / 1) rgb(5 46 22 / 1);">

      <div class="min-w-64 flex flex-wrap place-content-evenly">
        <LazyProductItem
        v-for="product in data?.productList"
        :key="product.id"
        :product="product"
        @preference-change="(event) => setPreference(product.id, event.value)"
        />
      </div>
      <div class="flex w-full place-items-center">
        <button :disabled="query.page <= 0" class="ml-auto" @click="query.page--">
          <IconArrow class="rotate-180" />
        </button>
        <div class="text-xl">{{ query.page }}</div>
        <button class="mr-auto" @click="query.page++">
          <IconArrow />
        </button>
      </div>
    </div>
  </div>
</template>
