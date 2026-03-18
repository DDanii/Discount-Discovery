<script setup lang="ts">
import type { CategoryWithPreference } from '~/utils/types/category';
import { defaultFilterWithPage } from '~/utils/types/Filter';
import { CategoryDB, getDocs, getSettings, PreferencesDB } from '~/database/database';
import { PreferenceType, type Preference } from '~/utils/types/preference';
import { prefMapper } from '~/utils/utils';

const settings = await getSettings()
const categoriesDB = new CategoryDB()
const preferencesDB = new PreferencesDB()
const preferencesData = ref([] as Preference[])
const data = ref([] as CategoryWithPreference[])
const filters = reactive(defaultFilterWithPage())
const filtered = ref({} as CategoryWithPreference[])

async function updateData() {
  const allPreferences = await preferencesDB.allDocs({ include_docs: true })
  preferencesData.value = getDocs(allPreferences)

  const allProduct = await categoriesDB.allDocs({include_docs: true})
  data.value = prefMapper(getDocs(allProduct), preferencesData.value)
}

setDefaultFilters()
await updateData()

watch([filters, data], filtering)
filtering()

function setDefaultFilters() {
  Object.assign(filters, settings?.categoryFilters)
}

function filtering() {
  if (!data.value) return

  const categoryPreferenceFilter = createFilterList(filters)

  filtered.value = data.value
    .filter(c => categoryPreferenceFilter.includes(c.preference))
    .slice(...pageSlice(pageSize, filters.page))
}

async function setPreference(id: string, value: boolean | null) {
  const pref = data.value.find(p => p._id == id)
  if (pref)
    pref.preference = value
  data.value = [...data.value]
  console.log(await preferencesDB.upsert(id, (doc) => {
    doc.value = value
    doc.type = PreferenceType.category
    return doc as Preference
  }))
}
</script>

<template>
  <PageWithSideBar :pageFilter=filters>
    <template #sideBar>
      <PreferenceFilter :filter=filters>
        <template #header>
          <IconCategoryPreference />
        </template>
      </PreferenceFilter>
    </template>

    <template #content>
      <div class="min-w-64 flex flex-wrap place-content-evenly">
        <PreferenceFrame v-for="category in filtered" :key="category._id" :preference="category.preference"
          @preference-change="(event) => setPreference(category._id, event.value)">
          <template #content>
            <h3 class="text-center mb-10 mt-10">{{ category._id }}</h3>
          </template>
        </PreferenceFrame>
      </div>
    </template>
  </PageWithSideBar>
</template>
