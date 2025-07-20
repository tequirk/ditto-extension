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
  sm: 'py-2 px-3.5 text-sm w-20',
  md: 'py-2 px-4 text-sm font-medium',
}
</script>

<template>
  <button
    class="bg-[#af8c61] text-white border-none rounded-md cursor-pointer transition-all duration-200 hover:brightness-90 dark:hover:brightness-110"
    :class="sizeClasses[size]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
