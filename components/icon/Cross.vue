<script setup lang="ts">

defineProps({
    isFilled: { type: Boolean, default: false }
})
</script>

<template>
	<svg xmlns="http://www.w3.org/2000/svg" :class="{ ['fill-transparent']: !isFilled, ['fill-red-600']: isFilled }" width="2em" height="2em" viewBox="0 0 512 512">
		<path class="stroke-red-600" d="M513 76.8L436.2 0L257 179.2L77.8 0L1 76.8L180.2 256L1 435.2L77.8 512L257 332.8L436.2 512l76.8-76.8L333.8 256z" stroke-width="35" />
	</svg>
</template>
