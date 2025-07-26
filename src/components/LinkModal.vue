<template>
  <div
    v-if="isOpen"
    class="fixed top-0 left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[1000]"
  >
    <div
      class="bg-white dark:bg-[#2b2b2b] rounded-lg w-80 max-w-[90%] shadow-[0_10px_25px_rgba(0,0,0,0.3)] dark:border dark:border-[#393939]"
    >
      <div class="flex flex-col flex-1 px-5 py-5.5 gap-3">
        <ErrorMessage :show="!!error" :message="error" />

        <FormField
          v-model="newLink.label"
          :label="UI_TEXT.TITLE_LABEL"
          :placeholder="UI_TEXT.TITLE_PLACEHOLDER"
          :has-error="!!error || labelError"
        />

        <FormField
          v-model="newLink.url"
          :label="UI_TEXT.URL_LABEL"
          :placeholder="UI_TEXT.URL_PLACEHOLDER"
          :has-error="!!error || urlError"
          type="url"
        />
      </div>
      <div class="flex h-12 px-3 justify-between items-center dark:border-t dark:border-[#444]">
        <SecondaryButton size="sm" @click="handleCancel">
          {{ UI_TEXT.CANCEL_BUTTON }}
        </SecondaryButton>
        <PrimaryButton size="sm" @click="handleSave">
          {{ UI_TEXT.SAVE_BUTTON }}
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

import { UI_TEXT } from '../constants'
import type { Link } from '../types'
import { generateLinkId } from '../utils/linkUtils'
import ErrorMessage from './ui/ErrorMessage.vue'
import FormField from './ui/FormField.vue'
import PrimaryButton from './ui/PrimaryButton.vue'
import SecondaryButton from './ui/SecondaryButton.vue'

interface Props {
  isOpen: boolean
  error?: string
}

interface Emits {
  (e: 'close'): void
  (e: 'save', link: Link): void
}

const props = withDefaults(defineProps<Props>(), {
  error: '',
})

const emit = defineEmits<Emits>()

function getCurrentTabUrl(): Promise<string> {
  const tabsApi = typeof browser !== 'undefined' ? browser.tabs : chrome.tabs
  return new Promise((resolve) => {
    tabsApi.query({ active: true, currentWindow: true }, (tabs: browser.tabs.Tab[]) => {
      const tab = tabs[0]
      resolve(tab?.url || '')
    })
  })
}

const newLink = reactive<Link>({
  id: '',
  label: '',
  url: '',
})

// Computed properties for field validation
const labelError = computed(() => {
  if (!newLink.label.trim()) return false
  return false
})

const urlError = computed(() => {
  if (!newLink.url.trim()) return false
  return false
})

// Reset form when modal opens/closes
watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen) {
      newLink.id = generateLinkId()
      newLink.label = ''
      newLink.url = await getCurrentTabUrl()
    }
  },
)

function handleCancel() {
  emit('close')
}

function handleSave() {
  emit('save', { ...newLink })
}
</script>
