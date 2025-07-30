<template>
  <div class="flex flex-col flex-1 min-h-0 relative">
    <!-- Edit Mode -->
    <div
      ref="scrollContainer"
      class="flex-1 overflow-y-auto px-3 pb-0 max-h-[400px]"
      @scroll="handleScroll"
    >
      <div ref="sortableContainer" class="flex flex-col gap-2 mt-2">
        <div
          v-for="(link, index) in links"
          :key="link.id"
          class="flex flex-col items-stretch p-3 gap-2 bg-white/80 dark:bg-[#2a2a2a] rounded-lg border-1 border-[#ddd] dark:border-[#393939] cursor-grab hover:bg-white/90 dark:hover:bg-[#2d2d2d] flex-shrink-0 last:mb-2"
          :class="{
            // Tailwind sandwich animation classes
            '!max-h-0 !pt-0 !pb-0 !mt-0 !mb-0 !overflow-hidden !opacity-0 !scale-y-0 !origin-center duration-300':
              props.deletingIndex === index,
          }"
        >
          <div class="flex w-full items-start">
            <div class="flex flex-col flex-1 px-2 py-2.5 gap-3">
              <ErrorMessage :show="!!link.error" :message="link.error" />

              <FormField
                v-model="link.label"
                :label="UI_TEXT.TITLE_LABEL"
                :has-error="link.hasTitleError"
                @input="handleValidate(link, index)"
              />

              <FormField
                v-model="link.url"
                :label="UI_TEXT.URL_LABEL"
                :has-error="link.hasUrlError"
                type="url"
                @input="handleValidate(link, index)"
              />
            </div>
            <DeleteButton @click="handleDelete(index)">
              <TrashIcon
                class="w-6 h-6 inline-block text-stone-400 hover:text-stone-500 dark:hover:text-stone-300 transition-colors"
              />
            </DeleteButton>
          </div>
        </div>
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
        class="absolute left-1/2 transform -translate-x-1/2 bottom-16 z-10 w-8 h-8 bg-white/90 dark:bg-[#2b2b2b]/90 border border-[#ddd] dark:border-[#393939] rounded-full shadow-lg backdrop-blur-sm hover:bg-white dark:hover:bg-[#2b2b2b] transition-all duration-200 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-stone-800 dark:hover:text-white hover:scale-105"
        @click="handleScrollClick"
        :aria-label="isAtBottom ? 'Scroll to top' : 'Scroll to bottom'"
      >
        <ChevronDownIcon
          class="w-4 h-4 transition-transform duration-200"
          :class="{ 'rotate-180': isAtBottom }"
        />
      </button>
    </Transition>

    <!-- Edit Mode Footer -->
    <div
      class="flex-shrink-0 bg-[#e8e5e2] dark:bg-[#1e1e1e] backdrop-blur-[10px] p-3 flex justify-between items-center gap-3 min-h-7 dark:text-white border-t border-black/10 dark:border-[#393939]"
    >
      <SecondaryButton @click="handleFinish">
        {{ UI_TEXT.DONE_BUTTON }}
      </SecondaryButton>
      <PrimaryButton @click="handleAddLink">
        {{ UI_TEXT.NEW_LINK_BUTTON }}
      </PrimaryButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { useDark } from '@vueuse/core'
import { useSortable } from '@vueuse/integrations/useSortable'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'

import { UI_TEXT } from '../constants'
import type { Link } from '../types'
import DeleteButton from './ui/DeleteButton.vue'
import ErrorMessage from './ui/ErrorMessage.vue'
import FormField from './ui/FormField.vue'
import PrimaryButton from './ui/PrimaryButton.vue'
import SecondaryButton from './ui/SecondaryButton.vue'

interface Props {
  links: Link[]
  deletingIndex?: number
  isAdding?: boolean
  isDeleting?: boolean
}

interface Emits {
  (e: 'delete', index: number): void
  (e: 'validate', link: Link, index: number): void
  (e: 'finish'): void
  (e: 'add-link'): void
  (e: 'reorder', newOrder: Link[]): void
}

const props = withDefaults(defineProps<Props>(), {
  deletingIndex: -1,
})
const emit = defineEmits<Emits>()

// Ref for the sortable container
const sortableContainer = ref<HTMLElement>()

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

// Setup sortable functionality
useSortable(sortableContainer, props.links, {
  animation: 200,
  filter: '.ignore-drag',
  preventOnFilter: false,
  chosenClass: 'sortable-chosen',
  dragClass: 'sortable-drag',
  forceFallback: true,
  fallbackOnBody: true,
  ghostClass: useDark().value ? 'sortable-ghost-dark' : 'sortable-ghost',
  onUpdate: (e: { oldIndex?: number; newIndex?: number }) => {
    // Create new array with reordered items
    if (e.oldIndex !== undefined && e.newIndex !== undefined) {
      const newOrder = [...props.links]
      const [removed] = newOrder.splice(e.oldIndex, 1)
      newOrder.splice(e.newIndex, 0, removed)
      emit('reorder', newOrder)
    }
  },
})

function handleDelete(index: number) {
  emit('delete', index)
}

function handleValidate(link: Link, index: number) {
  emit('validate', link, index)
}

function handleFinish() {
  emit('finish')
}

function handleAddLink() {
  emit('add-link')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !props.isAdding && !props.isDeleting) {
    handleFinish()
  }
}

// Set up resize observer to track content changes
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)

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
  document.removeEventListener('keydown', handleKeydown)
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<style scoped>
.sortable-ghost {
  opacity: 0.5;
  outline: 2px dashed #af8c61;
  outline-offset: -2px;
}

.sortable-ghost-dark {
  opacity: 0.5;
  filter: brightness(2);
  outline: 2px dashed #af8c61;
  outline-offset: -2px;
}

.sortable-chosen {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.sortable-drag {
  transform: rotate(1deg);
}

.grabbing {
  cursor: grabbing;
}
</style>

<style>
body:has(.sortable-chosen) * {
  user-select: none;
  cursor: grabbing !important;
}
</style>
