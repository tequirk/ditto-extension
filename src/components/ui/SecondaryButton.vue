<template>
  <button
    class="bg-[#d3d3d3] dark:bg-[#555] text-black dark:text-white border-none rounded-md cursor-pointer transition-all duration-200 hover:brightness-90 dark:hover:brightness-110"
    :class="sizeClasses[size]"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean
  size?: 'sm' | 'md'
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  size: 'md',
})

const sizeClasses = {
  sm: 'py-1.5 px-3.5 text-sm w-20',
  md: 'py-1.5 px-4 text-sm font-medium',
}
</script>
