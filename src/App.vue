<template>
  <div class="font-[sans-serif] m-0 w-[360px] bg-[#e8e5e2] dark:bg-[#1e1e1e] flex flex-col">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <div class="flex flex-col flex-1 min-h-0">
      <!-- Links List -->
      <LinksList
        v-if="store.hasLinks && !store.isManaging"
        :links="store.links"
        @copy="handleCopy"
        @edit="handleEdit"
        @reorder="handleReorder"
      />

      <!-- Edit Mode / Empty State -->
      <EditMode
        v-if="store.isManaging"
        :links="store.links"
        :deleting-index="deletingIndex"
        :is-adding="store.isAdding"
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

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmation
      :is-open="showDeleteConfirmation"
      :link-title="linkToDelete?.label"
      @cancel="handleCancelDelete"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import AppHeader from './components/AppHeader.vue'
import DeleteConfirmation from './components/DeleteConfirmation.vue'
import EditMode from './components/EditMode.vue'
import EmptyState from './components/EmptyState.vue'
import LinkModal from './components/LinkModal.vue'
import LinksList from './components/LinksList.vue'
import * as theme from './services/theme'
import { useLinksStore } from './stores/useLinksStore'
import type { Link } from './types'

// Use the links store
const store = useLinksStore()

// Delete confirmation state
const showDeleteConfirmation = ref(false)
const linkToDelete = ref<Link | null>(null)
const linkIndexToDelete = ref<number>(-1)
const deletingIndex = ref<number>(-1)

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
  // Show confirmation dialog instead of directly deleting
  linkToDelete.value = store.links[index]
  linkIndexToDelete.value = index
  showDeleteConfirmation.value = true
}

function handleCancelDelete() {
  showDeleteConfirmation.value = false
  linkToDelete.value = null
  linkIndexToDelete.value = -1
  deletingIndex.value = -1
}

function handleConfirmDelete() {
  if (linkIndexToDelete.value >= 0) {
    const isLastItem = store.links.length === 1

    if (isLastItem) {
      // For the last item, delete immediately - no animation
      store.deleteLink(linkIndexToDelete.value)
      showDeleteConfirmation.value = false
      linkToDelete.value = null
      linkIndexToDelete.value = -1
      deletingIndex.value = -1
    } else {
      // For multiple items, use the sandwich animation
      deletingIndex.value = linkIndexToDelete.value

      // Close the modal immediately
      showDeleteConfirmation.value = false
      linkToDelete.value = null

      // Wait for animation to complete, then delete
      setTimeout(() => {
        store.deleteLink(linkIndexToDelete.value)
        deletingIndex.value = -1
        linkIndexToDelete.value = -1
      }, 300) // Match the animation duration
    }
  }
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

.dark {
  background: #1e1e1e;
}
</style>
