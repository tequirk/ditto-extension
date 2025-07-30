<template>
  <div>
    <label class="block text-xs pl-1.5 text-[#888] dark:text-[#bbb] mb-1 cursor-grab">
      {{ label }}
    </label>
    <div class="relative group">
      <input
        ref="inputRef"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        class="ignore-drag w-full px-1.5 py-1 border border-gray-300 dark:border-[#555] bg-[#edeceb] dark:bg-[#1f1f1f] dark:text-white rounded text-[13px] box-border focus:outline-none focus:border-[#d2b38c] focus:shadow-[0_0_0_2px_rgba(210,179,140,0.2)]"
        :class="{
          'border-rose-500 dark:border-rose-600 bg-rose-600/10': hasError,
          'pr-6': modelValue.length > 0,
        }"
        @input="handleInput"
        @paste="handlePaste"
        @blur="handleBlur"
      />
      <button
        v-if="modelValue.length > 0"
        type="button"
        class="absolute right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-[#888] dark:text-[#bbb] hover:text-[#666] dark:hover:text-[#ddd] transition-colors ignore-drag cursor-pointer opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100"
        @click="clearField"
        @mousedown.prevent
        tabindex="-1"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L9 9M9 1L1 9"
            stroke="currentColor"
            stroke-width="1.2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
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

function clearField() {
  emit('update:modelValue', '')
  // Emit a synthetic input event to trigger validation in parent
  emit('input', new InputEvent('input'))
  inputRef.value?.focus()
}

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
