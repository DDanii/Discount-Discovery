<template>
  <div class="w-fit border rounded-md bg-black border-green-600 m-1 flex flex-col overflow-hidden items-center">
    <slot class="mt-1"/>
    <div class="flex place-content-around mt-auto">
      <button class="p-1 border-t border-r border-green-600 flex place-content-center">
        <IconTick :is-filled="true" class="w-1 h-1"/>
      </button>
      <button class="p-1 border-t border-green-600 flex place-content-center" >
        <IconCross :is-filled="true" class="w-1 h-1"/>
      </button> 
    </div>
  </div>
</template>