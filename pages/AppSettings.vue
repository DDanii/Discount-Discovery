<script setup lang="ts">
import { getSettings, setSettings } from '~/database/database';
import { defaultSettings } from '~/utils/types/settings';
const settingsFromDB = await getSettings()

const settings = reactive(defaultSettings())

Object.assign(settings.productFilters, settingsFromDB.productFilters)
Object.assign(settings.categoryFilters, settingsFromDB.categoryFilters)
Object.assign(settings.productByCategoryFilters, settingsFromDB.productByCategoryFilters)

watch(settings, updateSettings)

function updateSettings() {
  setSettings(deepCopy(settings))
}
</script>

<template>
  <div class="flex flex-wrap overflow-y-auto"
            style="scrollbar-color:rgb(22 163 74 / 1) rgb(5 46 22 / 1);">
    <div class="rounded-xl border-yellow-500 border-2 w-fit m-2">
      <IconProductPreference />
      <div class="flex border-t-2 border-yellow-500 flex-wrap place-content-center">

        <PreferenceFilter :filter="settings.productFilters">
          <template #header>
            <IconProductPreference />
          </template>
        </PreferenceFilter>
        <PreferenceFilter :filter="settings.productByCategoryFilters">
          <template #header>
            <IconCategoryPreference />
          </template>
        </PreferenceFilter>
      </div>
    </div>

    <PreferenceFilter :filter="settings.categoryFilters">
      <template #header>
        <IconCategoryPreference />
      </template>
    </PreferenceFilter>
    <DBProfileManager />

  </div>
</template>
