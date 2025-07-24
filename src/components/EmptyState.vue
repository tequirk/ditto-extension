<script setup lang="ts">
import { UI_TEXT } from '../constants'
import PrimaryButton from './ui/PrimaryButton.vue'

interface Emits {
  (e: 'add-link'): void
}

const emit = defineEmits<Emits>()

function handleAddLink() {
  emit('add-link')
}
</script>

<template>
  <div class="flex flex-col flex-1">
    <!-- Empty State Content -->
    <div class="flex flex-col justify-center items-center text-center py-2.5 px-5 flex-1 mb-[72px]">
      <img
        src="/splash-light.svg"
        :alt="UI_TEXT.EMPTY_STATE_ALT"
        class="w-[200px] h-auto mb-[26px] dark:hidden"
        draggable="false"
      />
      <img
        src="/splash-dark.svg"
        :alt="UI_TEXT.EMPTY_STATE_ALT"
        class="w-[200px] h-auto mb-[26px] hidden dark:block"
        draggable="false"
      />
    </div>

    <!-- Empty State Footer -->
    <div
      class="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#1e1e1e] backdrop-blur-[10px] p-3 flex justify-end items-center h-[60px] px-3 pb-3 box-border dark:text-white"
    >
      <!-- Get started content -->
      <div
        class="flex items-center gap-3 text-base text-gray-600 dark:text-[#bbb] font-medium mr-4"
      >
        <span>{{ UI_TEXT.GET_STARTED_TEXT }}</span>
        <img
          src="/splash-arrow.svg"
          :alt="UI_TEXT.GET_STARTED_ARROW_ALT"
          class="w-[100px] h-auto opacity-30 dark:opacity-50"
          draggable="false"
        />
      </div>

      <!-- Add Link Button -->
      <PrimaryButton @click="handleAddLink">
        {{ UI_TEXT.NEW_LINK_BUTTON }}
      </PrimaryButton>
    </div>
  </div>
</template>
