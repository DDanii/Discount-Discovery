<script setup lang="ts">
import { docMap, ShopDB } from '~/database/database';
import type { ShopFilter } from '~/utils/types/Filter';
import type { Shop } from '~/utils/types/shop';

const props = defineProps<{
    shop: ShopFilter
}>()

const shopData = ref({} as Shop)

shopData.value = await getShopInfo()

async function getShopInfo(): Promise<Shop>{
    const shopInfo = await (new ShopDB()).get(props.shop.shopId)
    return docMap(shopInfo)
}

</script>
<template>
    <FilterButton :state="shop.enabled" @change="(value) => shop.enabled = value">
        <img v-if="shopData.icon" :src="shopData.icon ?? ''" class="h-8"/>
        <div v-else class="m-auto ml-1">{{ shopData.name }}</div>
    </FilterButton>
</template>