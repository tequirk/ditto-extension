<script setup lang="ts">
import { ref } from 'vue'
import { useSortable } from '@vueuse/integrations/useSortable'
import LinkItem from './LinkItem.vue'
import TextButton from './ui/TextButton.vue'
import type { Link } from '../types'
import { UI_TEXT } from '../constants'

interface Props {
  links: Link[]
}

interface Emits {
  (e: 'copy', link: Link): void
  (e: 'edit'): void
  (e: 'reorder', newOrder: Link[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Ref for the sortable container
const sortableContainer = ref<HTMLElement>()

// Setup sortable functionality
useSortable(sortableContainer, props.links, {
  animation: 200,
  ghostClass: 'sortable-ghost',
  chosenClass: 'sortable-chosen',
  dragClass: 'sortable-drag',
  onUpdate: (e: { oldIndex?: number; newIndex?: number }) => {
    // Create new array with reordered items
    if (e.oldIndex !== undefined && e.newIndex !== undefined) {
      const newOrder = [...props.links]
      const [removed] = newOrder.splice(e.oldIndex, 1)
      newOrder.splice(e.newIndex, 0, removed)
      emit('reorder', newOrder)
    }
  }
})

function handleCopy(link: Link) {
  emit('copy', link)
}

function handleEdit() {
  emit('edit')
}
</script>

<template>
  <div class="flex flex-col flex-1">
    <!-- Links List -->
    <div 
      ref="sortableContainer"
      class="flex flex-col overflow-y-auto max-h-[300px] px-3 mb-[72px]"
    >
      <LinkItem
        v-for="(link, index) in links"
        :key="`${link.label}-${link.url}`"
        :link="link"
        :index="index"
        class="cursor-move hover:bg-white/90 dark:hover:bg-[#2d2d2d] transition-colors duration-200"
        @copy="handleCopy"
      />
    </div>

    <!-- Links Footer -->
    <div
      class="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#1e1e1e] backdrop-blur-[10px] p-3 flex justify-center items-center gap-3 min-h-7 dark:text-white"
    >
      <TextButton @click="handleEdit">
        {{ UI_TEXT.EDIT_LINKS_BUTTON }}
      </TextButton>
    </div>
  </div>
</template>

<style scoped>
.sortable-ghost {
  opacity: 0.5;
  background: #f3f4f6;
}

.sortable-chosen {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.sortable-drag {
  transform: rotate(2deg);
}
</style>
