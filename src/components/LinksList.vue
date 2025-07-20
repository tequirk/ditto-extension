<script setup lang="ts">
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
      class="flex flex-col overflow-y-auto max-h-[300px] px-3 mb-[72px]"
    >
      <LinkItem
        v-for="(link, index) in links"
        :key="`${link.label}-${link.url}`"
        :link="link"
        :index="index"
        class="hover:bg-white/90 dark:hover:bg-[#2d2d2d] transition-colors duration-200"
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
