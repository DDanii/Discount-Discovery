<script setup lang="ts">
import { useSideBarOpen } from '~/composable/states';
import type { ListQuery } from '~/utils/types/ListQuery';

const sidebarOpen = useSideBarOpen()

const props = defineProps<{
    query: ListQuery
}>()

</script>
<template>
    <div class="flex flex-wrap h-full w-full overflow-hidden">
        <div :class="{ ['collapse']: !sidebarOpen }"
            class="w-full min-w-fit h-full flex place-content-center flex-shrink-0 basis-0 flex-grow bg-green-950 border-r-2 border-green-600">
            <div class="flex flex-col place-content-center h-full w-fit">
                <slot name="sideBar"></slot>
            </div>
        </div>
        <div class="w-72 h-full overflow-y-auto"
            style="flex-grow:100; scrollbar-color:rgb(22 163 74 / 1) rgb(5 46 22 / 1);">
            <slot name="content"></slot>
            <div class="flex w-full place-items-center">
                <button :disabled="query.page <= 0" class="ml-auto" @click="query.page--">
                    <IconArrow class="rotate-180" />
                </button>
                <div class="text-xl">{{ query.page }}</div>
                <button class="mr-auto" @click="query.page++">
                    <IconArrow />
                </button>
            </div>
        </div>
    </div>
</template>
