<script setup lang="ts">
import PageWithSideBar from '~/components/PageWithSideBar.vue';
import PreferenceFilter from '~/components/PreferenceFilter.vue';
import PreferenceFrame from '~/components/PreferenceFrame.vue';
import { categories_name, product_name, settings_name } from '~/composable/states';
import { defaultProductFilters } from '~/utils/types/Filter';
import type { CategoryWithPreference } from '~/utils/types/categoryWithPreference';
import type { ProductWithPreference } from '~/utils/types/productWithPreference';
import type { Settings } from '~/utils/types/settings';

const { data } = useNuxtData<ProductWithPreference[]>(product_name)
const { data: settings } = useNuxtData<Settings>(settings_name)
const { data: fullCategoryList } = useNuxtData<CategoryWithPreference[]>(categories_name)

const filters = reactive(defaultProductFilters())
const filtered = ref({} as ProductWithPreference[])

watch(settings, setDefaultFilters)
setDefaultFilters()

function setDefaultFilters() {
  Object.assign(filters.productFilter, settings.value?.productFilters)
  Object.assign(filters.categoryFilter, settings.value?.productByCategoryFilters)
}

function filter() {
  const date = new Date().getTime()

  if (!data.value?.filter) return
  if (!fullCategoryList.value?.filter) return

  const productFilterList = createFilterList(filters.productFilter)
  const categoryPreferenceFilter = createFilterList(filters.categoryFilter)
  const categoryFilterList = fullCategoryList.value
    .filter(c => categoryPreferenceFilter.includes(c.preference)).map(c => c.name)

  filtered.value = data.value
    .filter((p) => p.startDate < date && p.endDate > date)
    .filter((p) => p.category ? categoryFilterList.includes(p.category) : true)
    .filter((p) => productFilterList.includes(p.preference))
    .slice(...pageSlice(pageSize, filters.page))
}

watch([filters, data], filter)
filter()

async function setPreference(id: number, value: boolean | null) {
  await optimisticUpdate("/api/products/preference",
    { productId: id, value: value },
    product_name,
    () => {
      let updated = data.value?.find(p => p.id == id)
      if (updated) {
        updated.preference = value
      }
    }
  )
}

</script>

<template>
  <PageWithSideBar :pageFilter=filters>
    <template #sideBar>
      <PreferenceFilter :filter=filters.productFilter>
        <template #header>
          <IconProductPreference />
        </template>
      </PreferenceFilter>
      <PreferenceFilter :filter=filters.categoryFilter>
        <template #header>
          <IconCategoryPreference />
        </template>
      </PreferenceFilter>
    </template>

    <template #content>
      <div class="min-w-64 flex flex-wrap place-content-evenly">
        <PreferenceFrame v-for="product in filtered" :key="product.id" :preference="product.preference"
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
