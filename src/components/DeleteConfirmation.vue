<template>
  <div
    v-if="isOpen"
    class="fixed top-0 left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[1000]"
  >
    <div
      class="bg-white dark:bg-[#2b2b2b] rounded-lg w-80 max-w-[90%] shadow-[0_10px_25px_rgba(0,0,0,0.3)] dark:border dark:border-[#393939]"
      ref="modalRef"
      tabindex="0"
    >
      <div class="flex flex-col flex-1 px-5 py-6 gap-4">
        <div class="text-center text-sm">
          <p class="text-stone-600 dark:text-stone-300">
            {{ UI_TEXT.DELETE_CONFIRMATION_MESSAGE }}
          </p>
        </div>
      </div>
      <div
        class="flex h-14 px-3 justify-between items-center border-t border-[#ddd] dark:border-[#444]"
      >
        <SecondaryButton size="sm" @click="handleCancel">
          {{ UI_TEXT.CANCEL_BUTTON }}
        </SecondaryButton>
        <PrimaryButton
          size="sm"
          class="!bg-rose-600 hover:!bg-rose-700 dark:!bg-rose-600 dark:hover:!bg-rose-500"
          @click="handleConfirmDelete"
        >
          {{ UI_TEXT.DELETE_BUTTON }}
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue'

import { UI_TEXT } from '../constants'
import PrimaryButton from './ui/PrimaryButton.vue'
import SecondaryButton from './ui/SecondaryButton.vue'

const isListenerActive = ref(false)

interface Props {
  isOpen: boolean
  linkTitle?: string
}

interface Emits {
  /** Emitted when the user cancels the deletion */
  (e: 'cancel'): void
  /** Emitted when the user confirms the deletion */
  (e: 'confirm'): void
}

const props = withDefaults(defineProps<Props>(), {
  linkTitle: '',
})

const emit = defineEmits<Emits>()

const modalRef = ref<HTMLDivElement | null>(null)

function handleCancel(): void {
  emit('cancel')
}

function handleConfirmDelete(): void {
  console.log('Confirmed deletion of link:', props.linkTitle)
  emit('confirm')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleConfirmDelete()
  }
}

watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen) {
      await nextTick()
      modalRef.value?.focus()
    }
    if (isOpen && !isListenerActive.value) {
      document.addEventListener('keydown', handleKeydown)
      isListenerActive.value = true
    } else if (!isOpen && isListenerActive.value) {
      document.removeEventListener('keydown', handleKeydown)
      isListenerActive.value = false
    }
  },
)

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
