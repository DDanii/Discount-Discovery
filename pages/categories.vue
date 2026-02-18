<script setup lang="ts">
import type { CategoryWithPreference } from '~/utils/types/categoryWithPreference';
import type { Settings } from '~/utils/types/settings';
import { categories_name, settings_name } from '~/composable/states';
import { defaultFilterWithPage } from '~/utils/types/Filter';
import optimisticUpdate from '~/utils/optimisticUpdate';

const query = reactive(defaultFilterWithPage())
const filtered = ref({} as CategoryWithPreference[])
const { data: settings } = useNuxtData<Settings>(settings_name)
const { data: fullCategoryList } = useNuxtData<CategoryWithPreference[]>(categories_name)

watch(settings, setDefaultFilters)
setDefaultFilters()

watch([query, fullCategoryList], filter)
filter()

function setDefaultFilters() {
  Object.assign(query, settings.value?.categoryFilters)
}

function filter() {
  if (!fullCategoryList.value?.filter) return

  const categoryPreferenceFilter = createFilterList(query)

  filtered.value = fullCategoryList.value
    .filter(c => categoryPreferenceFilter.includes(c.preference))
    .slice(...pageSlice(pageSize, query.page))
}

async function setPreference(category: string, value: boolean | null) {
  await optimisticUpdate('/api/categories/preference',
    { category: category, value: value },
    categories_name,
    () => {
      let updated = fullCategoryList.value?.find(c => c.name == category)
      if (updated) {
        updated.preference = value
      }
    }
  )
}
</script>

<template>
  <PageWithSideBar :pageFilter=query>
    <template #sideBar>
      <PreferenceFilter :filter=query>
        <template #header>
          <IconCategoryPreference />
        </template>
      </PreferenceFilter>
    </template>

    <template #content>
      <div class="min-w-64 flex flex-wrap place-content-evenly">
        <PreferenceFrame v-for="category in filtered" :key="category.name" :preference="category.preference"
          @preference-change="(event) => setPreference(category.name, event.value)">
          <template #content>
            <h3 class="text-center mb-10 mt-10">{{ category.name }}</h3>
          </template>
        </PreferenceFrame>
      </div>
    </template>
  </PageWithSideBar>
</template>
