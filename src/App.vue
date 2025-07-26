<template>
  <div
    class="font-[sans-serif] m-0 w-[360px] bg-[#e8e5e2] dark:bg-[#1e1e1e] overflow-hidden flex flex-col"
  >
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <div class="flex flex-col overflow-hidden min-h-0">
      <!-- Links List -->
      <LinksList
        v-if="store.hasLinks && !store.isManaging"
        :links="store.links"
        @copy="handleCopy"
        @edit="handleEdit"
        @reorder="handleReorder"
      />

      <!-- Edit Mode -->
      <EditMode
        v-else-if="store.isManaging"
        :links="store.links"
        @delete="handleDelete"
        @validate="handleValidate"
        @finish="handleFinish"
        @add-link="handleAddLink"
        @reorder="handleReorder"
      />

      <!-- Empty State -->
      <EmptyState v-else-if="!store.hasLinks" @add-link="handleAddLink" />
    </div>

    <!-- Add/Edit Modal -->
    <LinkModal
      :is-open="store.isAdding"
      :error="store.error"
      :existing-links="store.links"
      @close="handleCancel"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import AppHeader from './components/AppHeader.vue'
import EditMode from './components/EditMode.vue'
import EmptyState from './components/EmptyState.vue'
import LinkModal from './components/LinkModal.vue'
import LinksList from './components/LinksList.vue'
import * as theme from './services/theme'
import { useLinksStore } from './stores/useLinksStore'
import type { Link } from './types'

// Use the links store
const store = useLinksStore()

// Initialize dark mode and load data on mount
onMounted(async () => {
  theme.attach()
  await store.initialize()
})

// Event handlers that delegate to store actions
function handleCopy(link: Link) {
  store.copyToClipboard(link)
}

function handleEdit() {
  store.startEditing()
}

function handleReorder(newOrder: Link[]) {
  store.reorderLinks(newOrder)
}

function handleDelete(index: number) {
  store.deleteLink(index)
}

function handleValidate(link: Link, index: number) {
  store.validateLinkInRealTime(link, index)
}

function handleFinish() {
  store.finishEditing()
}

function handleAddLink() {
  store.startAdding()
}

function handleCancel() {
  store.cancelAdding()
}

async function handleSave(link: Link) {
  const success = await store.addLink(link)
  if (success) {
    store.cancelAdding()
  }
}
</script>

<style>
html,
body {
  background: #e8e5e2;
}

.dark html,
.dark body {
  background: #1e1e1e;
}

/* .app-overscroll-red {
  background: #e8e5e2;
  z-index: 1;
}

.dark .app-overscroll-red {
  background: #2a2a2a;
} */
</style>
