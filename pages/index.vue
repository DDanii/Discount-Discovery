<script setup lang="ts">
import { PreferencesDB, ProductsDB, getSettings, getDocs } from '~/database/database';
import { PreferenceType, type Preference } from '~/utils/types/preference';
import type { ProductWithPreferences } from '~/utils/types/product';
import PreferenceFilter from '~/components/PreferenceFilter.vue';
import PageWithSideBar from '~/components/PageWithSideBar.vue';
import PreferenceFrame from '~/components/PreferenceFrame.vue';
import { defaultProductFilters } from '~/utils/types/Filter';
import { prefMapper } from '~/utils/utils';

const settings = await getSettings()
const filters = reactive(defaultProductFilters())
Object.assign(filters.productFilter, settings?.productFilters)
Object.assign(filters.categoryFilter, settings?.productByCategoryFilters)

const productsDB = new ProductsDB()
productsDB.changes({ since: 'now' }).on('change', updateData)
const preferencesDB = new PreferencesDB()
preferencesDB.changes({ since: 'now' }).on('change', updateData)

const data = ref([] as ProductWithPreferences[])
const filtered = ref([] as ProductWithPreferences[])
let preferencesData = [] as Preference[]

watch([filters, data], filtering)
await updateData()

async function updateData() {
  const allPreferences = await preferencesDB.allDocs({ include_docs: true, });
  preferencesData = getDocs(allPreferences)

  const allProduct = await productsDB.allDocs({ include_docs: true })
  data.value = prefMapper(getDocs(allProduct), preferencesData)
}

function filtering() {
  const date = new Date().getTime()

  const productFilterList = createFilterList(filters.productFilter)
  let prefiltered = []

  if (filters.categoryFilter.neutral) {
    const categoryFilterList = creataInvertedFilterList(filters.categoryFilter)
    const filteredCategories = filterCategories(categoryFilterList)
    prefiltered = data.value.filter(d => !filteredCategories.includes(d.category))
  } else {
    const categoryFilterList = createFilterList(filters.categoryFilter)
    const filteredCategories = filterCategories(categoryFilterList)
    prefiltered = data.value.filter(d => filteredCategories.includes(d.category))
  }

  filtered.value = prefiltered
    .filter((p) => p.startDate < date && p.endDate > date)
    .filter((p) => productFilterList.includes(p.preference))
    .slice(...pageSlice(pageSize, filters.page))
}

function filterCategories(categoryFilterList: (boolean | null)[]): (string | null)[] {
  return preferencesData
    .filter(p => p.type == PreferenceType.category)
    .filter(p => categoryFilterList.includes(p.value))
    .map(p => p._id as string | null);
}

async function setPreference(id: string, value: boolean | null) {
  const pref = data.value.find(p => p._id == id)
  if (pref)
    pref.preference = value
  data.value = [...data.value]
  await preferencesDB.upsert(id, (doc) => {
    doc.value = value
    doc.type = PreferenceType.product
    return doc as Preference
  })
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
        <PreferenceFrame v-for="product in filtered" :key="product._id" :preference="product.preference"
          @preference-change="(event) => setPreference(product._id, event.value)">
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
