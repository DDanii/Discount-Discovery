<script setup lang="ts">
import PageWithSideBar from '~/components/PageWithSideBar.vue';
import PreferenceFilter from '~/components/PreferenceFilter.vue';
import PreferenceFrame from '~/components/PreferenceFrame.vue';
import { useListQuery } from '~/composable/states';

const query = useListQuery()
const { data } = useFetch('/api/products/list', { query: query })
if (!query.value.fetched)
  useFetch('/api/settings').then((response) => {
    Object.assign(query.value, response.data.value?.settings?.productFilters)
    query.value.fetched = true
  })


async function setPreference(id: number, value: boolean | null) {
  await $fetch("/api/products/preference", {
    method: "POST",
    body: { productId: id, value: value }
  }).then(() => {
    query.value.counter++
  }).catch((error) => {
    console.error("Error updating preference:", error);
  });
}
</script>

<template>
  <PageWithSideBar :query=query>
    <template #sideBar>
      <PreferenceFilter :filter=query />
    </template>

    <template #content>
      <div class="min-w-64 flex flex-wrap place-content-evenly">
        <PreferenceFrame v-for="product in data?.productList" :key="product.id" :preference="product.preference"
          @preference-change="(event) => setPreference(product.id, event.value)">
          <template #content>
            <img :src="product.image ?? ''" class="max-w-60 max-h-64 rounded-xl m-auto mt-2">
            <h3 class="text-center mt-auto">{{ product.name }}</h3>
            <h3 v-if="product.price != -1" class="text-center">{{ product.price }}</h3>
          </template>
          <template #details>
            <ProductDetails :product=product #details />
          </template>
        </PreferenceFrame>
      </div>
    </template>
  </PageWithSideBar>
</template>
