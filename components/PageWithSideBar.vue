<script setup lang="ts">
import { useSideBarOpen } from '~/composable/states';
import type { PageFilter } from '~/utils/types/Filter';

const sidebarOpen = useSideBarOpen()

const props = defineProps<{
    pageFilter: PageFilter
}>()

function onClick(page: number) {
    document.getElementById("scroll")?.scroll(0, 0)
}

</script>
<template>
    <div class="flex flex-wrap h-full w-full overflow-hidden">
        <div :class="{ ['collapse']: !sidebarOpen }"
            class="w-full min-w-fit h-full flex place-content-center flex-shrink-0 basis-0 flex-grow bg-green-950 border-r-2 overflow-scroll"
            style="scrollbar-color:rgb(22 163 74 / 1) rgb(5 46 22 / 1);">

        <div class="flex flex-col h-full w-fit m-auto">
                <slot name="sideBar"></slot>
            </div>
        </div>
        <div class="w-72 h-full overflow-y-auto"
            style="flex-grow:100; scrollbar-color:rgb(22 163 74 / 1) rgb(5 46 22 / 1);" id="scroll">
            <slot name="content"></slot>
            <div class="flex w-full place-items-center">
                <button :disabled="pageFilter.page <= 0" class="ml-auto" @click="onClick(pageFilter.page--)">
                    <IconArrow class="rotate-180" />
                </button>
                <div class="text-xl">{{ pageFilter.page }}</div>
                <button class="mr-auto" @click="onClick(pageFilter.page++)">
                    <IconArrow />
                </button>
            </div>
        </div>
    </div>
</template>
