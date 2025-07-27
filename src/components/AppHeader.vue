<script setup lang="ts">
import { useDark } from '@vueuse/core'

import { UI_TEXT } from '../constants'
</script>

<template>
  <div class="flex h-[120px] py-3 pl-4 pr-8">
    <img
      v-if="!useDark().value"
      src="/header-light.svg"
      :alt="UI_TEXT.LOGO_ALT"
      class="w-24 h-24 object-contain m-auto"
      draggable="false"
    />
    <img
      v-else
      src="/header-dark.svg"
      :alt="UI_TEXT.LOGO_ALT"
      class="w-24 h-24 object-contain m-auto"
      draggable="false"
    />
    <div class="flex flex-col flex-1 justify-center">
      <h1 class="text-2xl font-bold text-stone-800 dark:text-white">
        {{ UI_TEXT.APP_NAME }}
      </h1>
      <p class="text-stone-500 dark:text-stone-400">
        {{ UI_TEXT.APP_TAGLINE }}
        <a
          :href="UI_TEXT.BUY_COFFEE_URL"
          target="_blank"
          class="text-stone-400 dark:text-stone-500 underline text-xs hover:text-[#d2b38c] pl-1 transition-colors"
        >
          {{ UI_TEXT.BUY_COFFEE_LINK }}
        </a>
      </p>
    </div>
  </div>
</template>
