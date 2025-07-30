<template>
  <div class="flex flex-col flex-1 min-h-0 relative">
    <!-- Links List -->
    <div
      ref="scrollContainer"
      class="flex-1 overflow-y-auto p-3 pb-0 max-h-[300px]"
      @scroll="handleScroll"
    >
      <div class="flex flex-col gap-2">
        <LinkItem
          v-for="(link, index) in links"
          :key="`${link.label}-${link.url}`"
          :link="link"
          :index="index"
          class="hover:bg-white/90 dark:hover:bg-[#2d2d2d] transition-colors duration-200 flex-shrink-0"
          @copy="handleCopy"
        />
      </div>
    </div>

    <!-- Floating Scroll Indicator -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 scale-90 translate-y-2"
      leave-to-class="opacity-0 scale-90 translate-y-2"
    >
      <button
        v-if="showScrollIndicator"
        class="absolute left-1/2 transform -translate-x-1/2 bottom-12 z-10 w-8 h-8 bg-white/90 dark:bg-[#2b2b2b]/90 border border-[#ddd] dark:border-[#393939] rounded-full shadow-lg backdrop-blur-sm hover:bg-white dark:hover:bg-[#2b2b2b] transition-all duration-200 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-stone-800 dark:hover:text-white hover:scale-105 cursor-pointer"
        @click="handleScrollClick"
        :aria-label="isAtBottom ? 'Scroll to top' : 'Scroll to bottom'"
      >
        <ChevronDownIcon
          class="w-4 h-4 transition-transform duration-200"
          :class="{ 'rotate-180': isAtBottom }"
        />
      </button>
    </Transition>

    <!-- Links Footer -->
    <div
      class="flex-shrink-0 bg-[#e8e5e2] dark:bg-[#1e1e1e] backdrop-blur-[10px] p-3 flex justify-center items-center gap-3 min-h-7 dark:text-white"
    >
      <PrimaryButton @click="handleAddLink">
        {{ UI_TEXT.NEW_LINK_BUTTON }}
      </PrimaryButton>
      <TextButton @click="handleEdit">
        {{ UI_TEXT.EDIT_LINKS_BUTTON }}
      </TextButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'

import { UI_TEXT } from '../constants'
import type { Link } from '../types'
import LinkItem from './LinkItem.vue'
import PrimaryButton from './ui/PrimaryButton.vue'
import TextButton from './ui/TextButton.vue'

interface Props {
  links: Link[]
}

interface Emits {
  (e: 'copy', link: Link): void
  (e: 'edit'): void
  (e: 'reorder', newOrder: Link[]): void
  (e: 'add-link'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

// Scroll indicator state
const scrollContainer = ref<HTMLElement>()
const scrollTop = ref(0)
const scrollHeight = ref(0)
const clientHeight = ref(0)

// Computed properties for scroll state
const isScrollable = computed(() => scrollHeight.value > clientHeight.value)
const isAtBottom = computed(() => {
  if (!isScrollable.value) return false
  return scrollTop.value + clientHeight.value >= scrollHeight.value - 1 // -1 for rounding
})
const showScrollIndicator = computed(() => isScrollable.value)

// Update scroll dimensions
function updateScrollDimensions() {
  if (scrollContainer.value) {
    scrollHeight.value = scrollContainer.value.scrollHeight
    clientHeight.value = scrollContainer.value.clientHeight
  }
}

// Handle scroll events
function handleScroll() {
  if (scrollContainer.value) {
    scrollTop.value = scrollContainer.value.scrollTop
  }
}

// Handle scroll indicator click
function handleScrollClick() {
  if (!scrollContainer.value) return

  const targetScrollTop = isAtBottom.value ? 0 : scrollContainer.value.scrollHeight

  scrollContainer.value.scrollTo({
    top: targetScrollTop,
    behavior: 'smooth',
  })
}

// Set up resize observer to track content changes
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (scrollContainer.value) {
    updateScrollDimensions()

    // Watch for content size changes
    resizeObserver = new ResizeObserver(() => {
      nextTick(() => {
        updateScrollDimensions()
      })
    })
    resizeObserver.observe(scrollContainer.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

function handleCopy(link: Link) {
  emit('copy', link)
}

function handleEdit() {
  emit('edit')
}

function handleAddLink() {
  emit('add-link')
}
</script>
