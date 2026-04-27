<script setup lang="ts">
import type { Filter } from '~/utils/types/Filter';

const props = defineProps<{
    filter: Filter
}>()

</script>
<template>
    <div class="rounded-xl border-2  max-w-44 bg-black flex flex-col m-1">
        <div class="border-b-2 ">
            <slot name="header" />
        </div>
        <div class="m-auto flex flex-col max-h-full grow justify-center p-1">
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
        </div>
    </div>
</template>