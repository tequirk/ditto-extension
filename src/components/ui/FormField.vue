<template>
  <div>
    <label class="block text-xs text-[#888] dark:text-[#bbb] mb-1">
      {{ label }}
    </label>
    <input
      ref="inputRef"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      class="w-full px-1.5 py-1 border border-gray-300 dark:border-[#555] bg-[#edeceb] dark:bg-[#1f1f1f] dark:text-white rounded text-[13px] box-border focus:outline-none focus:border-[#d2b38c] focus:shadow-[0_0_0_2px_rgba(210,179,140,0.2)]"
      :class="{ 'border-red-600 bg-red-600/10': hasError }"
      @input="handleInput"
      @paste="handlePaste"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { formatUrl } from '../../utils/urlUtils'

interface Props {
  modelValue: string
  label: string
  placeholder?: string
  hasError?: boolean
  type?: 'text' | 'url' | 'email'
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'input', event: Event): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  hasError: false,
  type: 'text',
})

const emit = defineEmits<Emits>()

// Template ref for the input element
const inputRef = ref<HTMLInputElement>()

// Expose focus method for parent components
function focus() {
  inputRef.value?.focus()
}

defineExpose({ focus })

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('input', event)
}

function handlePaste(event: ClipboardEvent) {
  // Only auto-format URLs for URL type inputs
  if (props.type !== 'url') {
    return
  }

  event.preventDefault()

  const pastedText = event.clipboardData?.getData('text') || ''
  const formattedUrl = formatUrl(pastedText)

  // Update the input value
  const target = event.target as HTMLInputElement
  target.value = formattedUrl

  // Emit the formatted value
  emit('update:modelValue', formattedUrl)
  emit('input', event)
}

function handleBlur(event: FocusEvent) {
  // Only auto-format URLs for URL type inputs
  if (props.type !== 'url') {
    return
  }

  const target = event.target as HTMLInputElement
  const currentValue = target.value
  const formattedUrl = formatUrl(currentValue)

  // Only update if the URL was actually changed
  if (formattedUrl !== currentValue) {
    target.value = formattedUrl
    emit('update:modelValue', formattedUrl)
    emit('input', event)
  }
}
</script>
