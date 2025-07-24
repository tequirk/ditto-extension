<template>
  <div
    class="flex justify-between items-center h-10 bg-white/80 dark:bg-[#2b2b2b] rounded-lg transition-all duration-200 border overflow-hidden"
    :class="
      link.isCopied
        ? 'border-[#61af62] dark:border-[#61af62]'
        : 'border-[#ccc] dark:border-[#393939]'
    "
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
    <button
      class="flex items-center justify-center w-4 h-4 mr-2 text-gray-500 hover:text-gray-400 hover:cursor-pointer transition-colors"
      type="button"
      @click="handleOpen"
      :aria-label="UI_TEXT.OPEN_LINK_BUTTON"
    >
      <ArrowTopRightOnSquareIcon class="w-5 h-5" />
    </button>
    <CopyButton :is-copied="link.isCopied" @click="handleCopy" />
  </div>
</template>

<script setup lang="ts">
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'

import { UI_TEXT } from '../constants'
import type { Link } from '../types'
import { getDefaultFaviconUrl, getDomainFromUrl } from '../utils/urlUtils'
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

// Handle open link button click
function handleOpen() {
  window.open(props.link.url, '_blank')
}
</script>
