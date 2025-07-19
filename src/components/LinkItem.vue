<script setup lang="ts">
import type { Link } from '../types'
import { getDomainFromUrl, getDefaultFaviconUrl } from '../utils/urlUtils'
import { UI_TEXT } from '../constants'
import CopyButton from './ui/CopyButton.vue'

const props = defineProps<{
  link: Link
  index: number
}>()

const emit = defineEmits<{
  copy: [link: Link]
}>()

// Helper function to extract domain from URL
function getDomain(url: string): string {
  return getDomainFromUrl(url)
}

// Handle favicon loading errors
function handleFaviconError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = getDefaultFaviconUrl()
}

// Handle copy button click
function handleCopy() {
  emit('copy', props.link)
}

</script>

<template>
  <div
    class="flex justify-between items-center h-10 mb-1.5 bg-white/80 dark:bg-[#2b2b2b] rounded-lg transition-all duration-200 border border-[#ccc] dark:border-[#393939] overflow-hidden"
    :class="{ 'border-[#61af62]': link.isCopied }"
  >
    <div class="flex items-center flex-1 min-w-0 px-2.5 py-2">      
      <img
        :src="`https://www.google.com/s2/favicons?domain=${getDomain(link.url)}`"
        :alt="UI_TEXT.FAVICON_ALT"
        class="w-4 h-4 mr-2 flex-shrink-0"
        @error="handleFaviconError"
      />
      <span
        class="text-xs text-gray-800 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis"
      >
        {{ link.label }}
      </span>
    </div>
    <CopyButton 
      :is-copied="link.isCopied"
      @click="handleCopy"
    />
  </div>
</template>
