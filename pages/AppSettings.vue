<script setup lang="ts">
import { defaultFilter, FilterType, type TypedFilter } from '~/utils/types/Filter';

const productFilters = reactive({ ...defaultFilter(), type: FilterType.Product })
const categoryFilters = reactive({ ...defaultFilter(), type: FilterType.Category })
const productByCategoryFilters = reactive({ ...defaultFilter(), type: FilterType.ProductByCategory })
useFetch('/api/settings').then((response) => {
  Object.assign(productFilters, response.data.value?.productFilters)
  Object.assign(categoryFilters, response.data.value?.categoryFilters)
  Object.assign(productByCategoryFilters, response.data.value?.productByCategoryFilters)
  watch(productFilters, setFilter)
  watch(categoryFilters, setFilter)
  watch(productByCategoryFilters, setFilter)
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
  <div class="flex flex-wrap">
    <div class="rounded-xl border-yellow-500 border-2 w-fit m-2">
      <IconProductPreference />
      <div class="flex border-t-2 border-yellow-500 flex-wrap place-content-center">

        <PreferenceFilter :filter="productFilters">
          <template #header>
            <IconProductPreference />
          </template>
        </PreferenceFilter>
        <PreferenceFilter :filter="productByCategoryFilters">
          <template #header>
            <IconCategoryPreference />
          </template>
        </PreferenceFilter>
      </div>
    </div>

    <PreferenceFilter :filter="categoryFilters">
      <template #header>
        <IconCategoryPreference />
      </template>
    </PreferenceFilter>
  </div>
</template>
