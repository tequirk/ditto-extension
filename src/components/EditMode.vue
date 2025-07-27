<template>
  <div class="flex flex-col flex-1 min-h-0">
    <!-- Edit Mode -->
    <div class="flex-1 overflow-y-auto px-3 pb-0 max-h-[400px]">
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
                :has-error="link.hasError"
                @input="handleValidate(link, index)"
              />

              <FormField
                v-model="link.url"
                :label="UI_TEXT.URL_LABEL"
                :has-error="link.hasError"
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
import { useDark } from '@vueuse/core'
import { useSortable } from '@vueuse/integrations/useSortable'
import { onMounted, onUnmounted, ref } from 'vue'

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
  if (event.key === 'Enter' && !props.isAdding) {
    handleFinish()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
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
