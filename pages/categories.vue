<script setup lang="ts">
import { useCategoryListQuery } from '~/composable/states';

const query = useCategoryListQuery()
const { data } = useFetch('/api/categories/list', { query: query })
if (!query.value.fetched)
  useFetch('/api/settings').then((response) => {
    Object.assign(query.value, response.data.value?.settings?.categoryFilters)
    query.value.fetched = true
  })

async function setPreference(category: string, value: boolean | null) {
  await $fetch("/api/categories/preference", {
    method: "POST",
    body: { category: category, value: value }
  }).then(() => {
    query.value.counter++
  }).catch((error) => {
    console.error("Error updating category preference:", error);
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
        <PreferenceFrame v-for="category in data?.categoryList" 
          :key="category.name" :preference="category.preference"
          @preference-change="(event) => setPreference(category.name, event.value)"
        >
          <template #content>
            <h3 class="text-center mb-10 mt-10">{{ category.name }}</h3>
          </template>
        </PreferenceFrame>
      </div>
    </template>
  </PageWithSideBar>
</template>
