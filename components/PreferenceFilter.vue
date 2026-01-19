<script setup lang="ts">
import type { PreferenceFilter } from '~/utils/types/ListQuery';

const props = defineProps<{
    filter: PreferenceFilter
}>()

</script>
<template>
    <FilterButton :state="filter.liked" @change="(value) => filter.liked = value">
        <IconTick is-filled />
    </FilterButton>
    <FilterButton :state="filter.neutral" @change="(value) => filter.neutral = value">
        <IconTick />
        <IconCross />
    </FilterButton>
    <FilterButton :state="filter.disliked" @change="(value) => filter.disliked = value">
        <IconCross is-filled />
    </FilterButton>
</template>