import { VALIDATION_MESSAGES } from '../constants'
import type { Link } from '../types'

export interface ValidationResult {
  error?: string
  isValid: boolean
}

export function useValidation() {
  /**
   * Validate a link for basic requirements and duplicates
   */
  function validateLink(link: Link, allLinks: Link[], excludeIndex?: number): ValidationResult {
    const label = link.label.trim()
    const url = link.url.trim()

    // Check if both are empty first
    if (!label && !url) {
      return { error: VALIDATION_MESSAGES.BOTH_REQUIRED, isValid: false }
    }

    if (!label) {
      return { error: VALIDATION_MESSAGES.TITLE_REQUIRED, isValid: false }
    }

    if (!url) {
      return { error: VALIDATION_MESSAGES.URL_REQUIRED, isValid: false }
    }

    if (!/^https?:\/\//i.test(url)) {
      return {
        error: VALIDATION_MESSAGES.INVALID_URL_FORMAT,
        isValid: false,
      }
    }

    // Check for duplicates
    const duplicateIndex = allLinks.findIndex(
      (existing, index) =>
        index !== excludeIndex && (existing.label === label || existing.url === url),
    )

    if (duplicateIndex !== -1) {
      const duplicate = allLinks[duplicateIndex]

      // Check which field is duplicated and provide specific message
      const hasDuplicateTitle = duplicate.label === label
      const hasDuplicateUrl = duplicate.url === url

      if (hasDuplicateTitle && hasDuplicateUrl) {
        return {
          error: VALIDATION_MESSAGES.DUPLICATE_BOTH,
          isValid: false,
        }
      } else if (hasDuplicateTitle) {
        return {
          error: VALIDATION_MESSAGES.DUPLICATE_TITLE,
          isValid: false,
        }
      } else {
        return {
          error: VALIDATION_MESSAGES.DUPLICATE_URL,
          isValid: false,
        }
      }
    }

    return { isValid: true }
  }

  /**
   * Validate a single link in real-time during editing
   * Mutates the link object to set error state
   */
  function validateLinkRealTime(link: Link, allLinks: Link[], index: number) {
    const validation = validateLink(link, allLinks, index)

    if (!validation.isValid) {
      link.error = validation.error
      link.hasError = true

      // Set field-specific error states based on error type
      if (validation.error === VALIDATION_MESSAGES.BOTH_REQUIRED) {
        link.hasTitleError = true
        link.hasUrlError = true
      } else if (
        validation.error === VALIDATION_MESSAGES.TITLE_REQUIRED ||
        validation.error === VALIDATION_MESSAGES.DUPLICATE_TITLE
      ) {
        link.hasTitleError = true
        link.hasUrlError = false
      } else if (
        validation.error === VALIDATION_MESSAGES.URL_REQUIRED ||
        validation.error === VALIDATION_MESSAGES.INVALID_URL_FORMAT ||
        validation.error === VALIDATION_MESSAGES.DUPLICATE_URL
      ) {
        link.hasTitleError = false
        link.hasUrlError = true
      } else if (validation.error === VALIDATION_MESSAGES.DUPLICATE_BOTH) {
        link.hasTitleError = true
        link.hasUrlError = true
      } else {
        // Fallback: highlight both fields for unknown errors
        link.hasTitleError = true
        link.hasUrlError = true
      }
    } else {
      link.error = undefined
      link.hasError = false
      link.hasTitleError = false
      link.hasUrlError = false
    }
  }

  return {
    validateLink,
    validateLinkRealTime,
  }
}
