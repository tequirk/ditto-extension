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
        <ErrorMessage :show="!!validationMessage" :message="validationMessage || ''" />

        <FormField
          ref="labelFieldRef"
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
      <div
        class="flex h-14 px-3 justify-between items-center border-t border-[#ddd] dark:border-[#444]"
      >
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
import { computed, nextTick, onUnmounted, reactive, ref, watch } from 'vue'

import { useValidation } from '../composables/useValidation'
import { UI_TEXT } from '../constants'
import type { Link } from '../types'
import { generateLinkId } from '../utils/linkUtils'
import { formatUrl } from '../utils/urlUtils'
import ErrorMessage from './ui/ErrorMessage.vue'
import FormField from './ui/FormField.vue'
import PrimaryButton from './ui/PrimaryButton.vue'
import SecondaryButton from './ui/SecondaryButton.vue'

const isListenerActive = ref(false)

interface Props {
  isOpen: boolean
  error?: string
  existingLinks?: Link[]
}

interface Emits {
  (e: 'close'): void
  (e: 'save', link: Link): void
}

const props = withDefaults(defineProps<Props>(), {
  error: '',
  existingLinks: () => [],
})

const emit = defineEmits<Emits>()

const { validateLink } = useValidation()

// Track whether user has attempted to save
const hasAttemptedSave = ref(false)
// Template ref for the label field
const labelFieldRef = ref<InstanceType<typeof FormField>>()

function getCurrentTabUrl(): Promise<string> {
  const tabsApi = typeof browser !== 'undefined' ? browser.tabs : chrome.tabs
  return new Promise((resolve) => {
    tabsApi.query({ active: true, currentWindow: true }, (tabs: browser.tabs.Tab[]) => {
      const tab = tabs[0]
      resolve(tab?.url || '')
    })
  })
}

function getCurrentTabTitle(): Promise<string> {
  const tabsApi = typeof browser !== 'undefined' ? browser.tabs : chrome.tabs
  return new Promise((resolve) => {
    tabsApi.query({ active: true, currentWindow: true }, (tabs: browser.tabs.Tab[]) => {
      const tab = tabs[0]
      resolve(tab?.title || '')
    })
  })
}
const newLink = reactive<Link>({
  id: '',
  label: '',
  url: '',
})

// Computed properties for field validation - only show errors after save attempt
const labelError = computed(() => {
  if (!hasAttemptedSave.value) return false
  const validation = validateLink(newLink, props.existingLinks)
  return !validation.isValid && validation.error?.includes('title')
})

const urlError = computed(() => {
  if (!hasAttemptedSave.value) return false
  const validation = validateLink(newLink, props.existingLinks)
  return !validation.isValid && validation.error?.includes('URL')
})

// Get validation message for display
const validationMessage = computed(() => {
  if (!hasAttemptedSave.value) return null
  const validation = validateLink(newLink, props.existingLinks)
  return validation.isValid ? null : validation.error
})

// Check if form is valid
const isFormValid = computed(() => {
  const validation = validateLink(newLink, props.existingLinks)
  return validation.isValid
})

function handleCancel() {
  emit('close')
}

function handleSave() {
  hasAttemptedSave.value = true

  // Format the URL before validation and saving
  newLink.url = formatUrl(newLink.url)

  // Only proceed with save if form is valid
  if (isFormValid.value) {
    emit('save', { ...newLink })
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleSave()
  }
}

// Reset form when modal opens/closes
watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen) {
      newLink.id = generateLinkId()
      newLink.label = await getCurrentTabTitle()
      newLink.url = await getCurrentTabUrl()
      hasAttemptedSave.value = false // Reset validation state

      // Focus the URL field after the DOM has updated
      await nextTick()
      labelFieldRef.value?.focus()
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
