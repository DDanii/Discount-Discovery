<script setup lang="ts">
import { useListQuery } from '~/composable/states';

const filter = useListQuery()

</script>
<template>
    <div class="flex flex-col place-content-center h-full w-fit">
        <FilterButton :state="filter.liked" @change="(value) => filter.liked=value"> 
            <IconTick is-filled/>
        </FilterButton>
        <FilterButton :state="filter.neutral" @change="(value) => filter.neutral=value"> 
            <IconTick/> 
            <IconCross/> 
        </FilterButton>
        <FilterButton :state="filter.disliked" @change="(value) => filter.disliked=value"> 
            <IconCross is-filled/>
        </FilterButton>
    </div>
</template>