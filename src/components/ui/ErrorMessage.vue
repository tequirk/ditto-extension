<script setup lang="ts">
interface Props {
  message?: string
  show?: boolean
}

withDefaults(defineProps<Props>(), {
  message: '',
  show: false,
})
</script>

<template>
  <p
    v-if="show && message"
    class="text-white text-xs m-0 mb-2 bg-rose-500 dark:bg-rose-600 px-2 py-1 rounded box-border w-full"
  >
    {{ message }}
  </p>
</template>
