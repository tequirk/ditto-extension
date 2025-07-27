<template>
  <div
    v-if="isOpen"
    class="fixed top-0 left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[1000]"
  >
    <div
      class="bg-white dark:bg-[#2b2b2b] rounded-lg w-80 max-w-[90%] shadow-[0_10px_25px_rgba(0,0,0,0.3)] dark:border dark:border-[#393939]"
    >
      <div class="flex flex-col flex-1 px-5 py-6 gap-4">
        <div class="text-center text-sm">
          <p class="text-stone-600 dark:text-stone-300">
            {{ UI_TEXT.DELETE_CONFIRMATION_MESSAGE }}
          </p>
        </div>
      </div>
      <div
        class="flex h-12 px-3 justify-between items-center border-t border-[#ddd] dark:border-[#444]"
      >
        <SecondaryButton size="sm" @click="handleCancel">
          {{ UI_TEXT.CANCEL_BUTTON }}
        </SecondaryButton>
        <PrimaryButton
          size="sm"
          class="!bg-red-600 hover:!bg-red-700 dark:!bg-red-600 dark:hover:!bg-red-500"
          @click="handleDelete"
        >
          {{ UI_TEXT.DELETE_BUTTON }}
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UI_TEXT } from '../constants'
import PrimaryButton from './ui/PrimaryButton.vue'
import SecondaryButton from './ui/SecondaryButton.vue'

interface Props {
  /** Whether the modal is open */
  isOpen: boolean
  /** Optional title of the link to be deleted for display purposes */
  linkTitle?: string
}

interface Emits {
  /** Emitted when the user cancels the deletion */
  (e: 'cancel'): void
  /** Emitted when the user confirms the deletion */
  (e: 'confirm'): void
}

withDefaults(defineProps<Props>(), {
  linkTitle: '',
})

const emit = defineEmits<Emits>()

function handleCancel(): void {
  emit('cancel')
}

function handleDelete(): void {
  emit('confirm')
}
</script>
