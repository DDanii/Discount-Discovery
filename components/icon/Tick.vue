<script setup lang="ts">

defineProps({
    isFilled: { type: Boolean, default: false }
})
</script>

<template>
	<svg xmlns="http://www.w3.org/2000/svg" :class="{ ['fill-transparent']: !isFilled, ['fill-green-600']: isFilled  }" width="2em" height="2em" viewBox="0 0 512 512">
		<path class="stroke-green-600" d="M437.3 30L202.7 339.3L64 200.7l-64 64L213.3 478L512 94z" stroke-width="35" />
	</svg>
</template>
