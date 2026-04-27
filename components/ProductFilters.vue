<script setup lang="ts">
import type { ProductFilters } from '~/utils/types/Filter';
import ShopFilter from './ShopFilter.vue';

const props = defineProps<{
    filters: ProductFilters
}>()

</script>

<template>
    <div class="p-2 max-w-44 flex flex-col place-content-evenly">
        <input type="text" v-model="filters.name" class="bg-black border-2 rounded-xl m-1 max-w-44 p-2" />
        <ShopFilter v-for="shop in filters.shops" :shop="shop" />
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
    </div>
</template>