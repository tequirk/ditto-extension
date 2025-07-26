<template>
  <button
    class="border-none cursor-pointer px-3 h-full rounded-none transition-all duration-200 flex-shrink-0 flex items-center justify-center"
    :class="
      isCopied
        ? 'bg-[#61af62] dark:bg-[#61af62] text-white dark:text-white'
        : 'bg-[#d1cac2] dark:bg-[#333333] text-[#555] dark:text-white hover:brightness-90 dark:hover:bg-[#404040]'
    "
  >
    <ClipboardIcon v-if="!isCopied" class="w-4 h-4 inline-block" />
    <CheckIcon v-else class="w-4 h-4 inline-block" />
  </button>
</template>

<script setup lang="ts">
import { CheckIcon, ClipboardIcon } from '@heroicons/vue/24/outline'

interface Props {
  isCopied?: boolean
}

withDefaults(defineProps<Props>(), {
  isCopied: false,
})
</script>
