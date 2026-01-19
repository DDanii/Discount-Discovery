<script setup lang="ts">
import { defaultListQuery, FilterType, type TypedFilter } from '~/utils/types/ListQuery';

const productFilters = reactive({ ...defaultListQuery(), type: FilterType.Product })
const categoryFilters = reactive({ ...defaultListQuery(), type: FilterType.Category })
useFetch('/api/settings').then((response) => {
  Object.assign(productFilters, response.data.value?.settings?.productFilters)
  Object.assign(categoryFilters, response.data.value?.settings?.categoryFilters)
  watch(productFilters, setFilter)
  watch(categoryFilters, setFilter)
})

async function setFilter(filters: TypedFilter) {
  await $fetch("/api/settings/filter", {
    method: "POST",
    body: { ...filters }
  }).catch((error) => {
    console.error("Error updating default filter settings:", error);
  });
}

</script>

<template>
  <div class="rounded-xl border-2 border-green-600 max-w-44 m-2 ml-auto mr-auto">
    <IconProductPreference class="border-b border-green-600" />
    <PreferenceFilter :filter="productFilters" />
  </div>
  <div class="rounded-xl border-2 border-green-600 max-w-44 m-2 ml-auto mr-auto">
    <IconCategoryPreference class="border-b border-green-600" />
    <PreferenceFilter :filter="categoryFilters" />
  </div>
</template>
