<template>
  <div
    class="relative flex justify-between items-center h-10 bg-white/80 dark:bg-[#2b2b2b] rounded-lg overflow-hidden"
  >
    <!-- Sweeping green animation overlay -->
    <div
      v-if="showSweep"
      class="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
    >
      <div
        :class="[
          'absolute inset-0 bg-[#61af62] transition-transform hover:cursor-default',
          sweepFade
            ? 'transition-opacity duration-100 opacity-0'
            : 'transition-opacity duration-300 opacity-100',
          'clip-path-[polygon(0_40%,100%_0,100%_100%,32px_100%,0_60%)]',
          sweepActive ? 'translate-x-0' : 'translate-x-full',
        ]"
      ></div>
      <span
        class="relative flex items-center gap-1 text-white text-xs transition-opacity duration-100"
        :class="sweepActive && !sweepFade ? 'opacity-100 delay-75' : 'opacity-0'"
      >
        <CheckBadgeIcon class="w-4.25 h-4.25 text-white" />
        Copied!
      </span>
    </div>
    <!-- Main content, hidden when sweep is active -->
    <div
      class="flex items-center flex-1 min-w-0 px-2.5 py-2"
      :class="showSweep ? 'pointer-events-none' : ''"
    >
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
      :disabled="showSweep"
    >
      <ArrowTopRightOnSquareIcon class="w-5 h-5" />
    </button>
    <CopyButton :is-copied="link.isCopied" @click="handleCopy" :disabled="showSweep" />
  </div>
</template>

<script setup lang="ts">
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import { CheckBadgeIcon } from '@heroicons/vue/24/solid'
import { ref, watch } from 'vue'

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

const showSweep = ref(false)
const sweepActive = ref(false)
const sweepFade = ref(false)
let sweepTimeout: ReturnType<typeof setTimeout> | null = null
let sweepAnimTimeout: ReturnType<typeof setTimeout> | null = null
let sweepFadeTimeout: ReturnType<typeof setTimeout> | null = null

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

// Watch for isCopied to trigger sweep animation
watch(
  () => props.link.isCopied,
  (val) => {
    if (val) {
      showSweep.value = true
      sweepActive.value = false
      sweepFade.value = false
      if (sweepTimeout) clearTimeout(sweepTimeout)
      if (sweepAnimTimeout) clearTimeout(sweepAnimTimeout)
      if (sweepFadeTimeout) clearTimeout(sweepFadeTimeout)
      // Start sweep after next tick for transition
      sweepAnimTimeout = setTimeout(() => {
        sweepActive.value = true
      }, 10)
      // After sweep, start fade out
      sweepTimeout = setTimeout(() => {
        sweepFade.value = true
        sweepActive.value = false
        sweepFadeTimeout = setTimeout(() => {
          showSweep.value = false
          sweepFade.value = false
        }, 100)
      }, 1500)
    }
  },
)

// Handle open link button click
function handleOpen() {
  window.open(props.link.url, '_blank')
}
</script>
