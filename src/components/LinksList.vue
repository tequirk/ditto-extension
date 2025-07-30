<template>
  <div class="flex flex-col flex-1 min-h-0">
    <!-- Links List -->
    <div class="flex-1 overflow-y-auto p-3 pb-0 max-h-[300px]">
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
