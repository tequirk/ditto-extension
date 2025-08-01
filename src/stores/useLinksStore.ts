import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useErrorHandling } from '../composables/useErrorHandling'
import { useValidation } from '../composables/useValidation'
import { COPY_FEEDBACK_DURATION, DEFAULT_ERRORS } from '../constants'
import * as data from '../data'
import * as clipboard from '../services/clipboard'
import type { Link } from '../types'
import { addLinkToArray, processLinksForSave, removeLinkFromArray } from '../utils/linkUtils'

export const useLinksStore = defineStore('links', () => {
  // State
  const links = ref<Link[]>([])
  const isManaging = ref(false)
  const isAdding = ref(false)
  const isDeleting = ref(false)

  // Use validation composable
  const { validateLink, validateLinkRealTime } = useValidation()
  const { handleAsync, clearError, setError, error: errorHandlingError } = useErrorHandling()

  // Getters
  const hasLinks = computed(() => links.value.length > 0)

  // Actions
  async function loadLinks() {
    const result = await handleAsync(async () => {
      return await data.getLinks()
    }, DEFAULT_ERRORS.LOAD_FAILED)

    links.value = result ?? []
  }

  async function saveLinks(linksData: Link[]) {
    const result = await handleAsync(async () => {
      return await data.saveLinks(linksData)
    }, DEFAULT_ERRORS.SAVE_FAILED)

    if (result) {
      links.value = result
    }
  }

  async function copyToClipboard(link: Link) {
    const success = await handleAsync(async () => {
      await clipboard.copy(link.url)
      return true
    }, DEFAULT_ERRORS.COPY_FAILED)

    if (success) {
      // Show copied state
      link.isCopied = true

      // Reset after specified duration
      setTimeout(() => {
        link.isCopied = false
      }, COPY_FEEDBACK_DURATION)
    }
  }

  async function addLink(link: Link) {
    const validation = validateLink(link, links.value)

    if (!validation.isValid) {
      setError(validation.error || DEFAULT_ERRORS.INVALID_LINK)
      return false
    }

    const newLinks = addLinkToArray(links.value, link)
    await saveLinks(newLinks)
    clearError()
    return true
  }

  function deleteLink(index: number) {
    const newLinks = removeLinkFromArray(links.value, index)
    saveLinks(newLinks)

    // If all links are deleted while managing, exit manage mode
    if (newLinks.length === 0 && isManaging.value) {
      isManaging.value = false
    }
  }

  function reorderLinks(newOrder: Link[]) {
    links.value = newOrder
    saveLinks(newOrder)
  }

  function startEditing() {
    isManaging.value = true
  }

  function finishEditing() {
    // Validate all links before saving
    const { validLinks, hasErrors } = processLinksForSave(links.value, (link, allLinks, index) =>
      validateLink(link, allLinks, index),
    )

    if (hasErrors) {
      return false // Don't save if there are errors
    }

    saveLinks(validLinks)
    isManaging.value = false
    return true
  }

  function startAdding() {
    clearError()
    isAdding.value = true
  }
  function startDeleting() {
    isDeleting.value = true
  }

  function cancelAdding() {
    clearError()
    isAdding.value = false
  }

  function cancelDeleting() {
    isDeleting.value = false
  }

  function validateLinkInRealTime(link: Link, index: number) {
    validateLinkRealTime(link, links.value, index)
  }

  // Initialize store
  async function initialize() {
    await loadLinks()
  }

  return {
    addLink,
    cancelAdding,
    cancelDeleting,
    clearError,
    copyToClipboard,
    deleteLink,
    error: errorHandlingError,

    finishEditing,
    // Getters
    hasLinks,
    initialize,
    isAdding,
    isDeleting,
    isManaging,
    // State
    links,

    // Actions
    loadLinks,
    reorderLinks,
    saveLinks,
    startAdding,
    startEditing,
    startDeleting,
    validateLinkInRealTime,
  }
})
