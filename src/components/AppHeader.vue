<script setup lang="ts">
import { UI_TEXT } from '../constants'
</script>

<template>
  <div
    class="h-[120px] flex flex-col justify-center items-center text-center text-xs text-[#5b5b5b] dark:text-[#adadad] px-6 py-4"
  >
    <img
      src="/logo.png"
      :alt="UI_TEXT.LOGO_ALT"
      class="w-[84px] h-[54px] object-contain"
    />
    <h4 class="m-0 dark:text-[#adadad]">
      {{ UI_TEXT.APP_TAGLINE }}
    </h4>
    <a
      :href="UI_TEXT.BUY_COFFEE_URL"
      target="_blank"
      class="text-[#868686] underline text-xs mt-1 hover:text-[#d2b38c]"
    >
      {{ UI_TEXT.BUY_COFFEE_LINK }}
    </a>
  </div>
</template>
