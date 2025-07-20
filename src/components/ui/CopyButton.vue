<script setup lang="ts">
interface Props {
  isCopied?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isCopied: false
})
</script>

<template>
  <button
    class="border-none cursor-pointer px-3 h-full rounded-none transition-all duration-200 flex-shrink-0 flex items-center justify-center"
    :class="isCopied 
      ? 'bg-[#61af62] dark:bg-[#61af62] text-white dark:text-white' 
      : 'bg-[#d1cac2] dark:bg-[#333333] text-[#555] dark:text-white hover:bg-[#dfdad4] dark:hover:bg-[#404040]'
    "
  >
    <span v-if="!isCopied" class="text-sm inline-block">📋</span>
    <span v-else class="text-sm inline-block">✅</span>
  </button>
</template>
