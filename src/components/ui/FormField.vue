<template>
  <div>
    <label class="block text-xs text-[#888] dark:text-[#bbb] mb-1">
      {{ label }}
    </label>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      class="w-full px-1.5 py-1 border border-gray-300 dark:border-[#555] dark:bg-[#1f1f1f] dark:text-white rounded text-[13px] box-border focus:outline-none focus:border-[#d2b38c] focus:shadow-[0_0_0_2px_rgba(210,179,140,0.2)]"
      :class="{ 'border-red-600 bg-red-600/10': hasError }"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
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

withDefaults(defineProps<Props>(), {
  placeholder: '',
  hasError: false,
  type: 'text',
})

const emit = defineEmits<Emits>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('input', event)
}
</script>
