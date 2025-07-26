import type { Link } from '../types'

/**
 * Generates a unique ID for a link using crypto.randomUUID
 */
export function generateLinkId(): string {
  return crypto.randomUUID()
}

/**
 * Normalizes a link by trimming whitespace from label and url
 */
export function normalizeLink(link: Link): Link {
  return {
    ...link,
    label: link.label.trim(),
    url: link.url.trim(),
  }
}

/**
 * Creates a clean copy of a link with normalized fields
 */
export function createNormalizedLink(link: Link): Link {
  return {
    ...link,
    label: link.label.trim(),
    url: link.url.trim(),
  }
}

/**
 * Adds a link to an array and returns a new array
 */
export function addLinkToArray(links: Link[], newLink: Link): Link[] {
  const linkWithId = newLink.id ? newLink : { ...newLink, id: generateLinkId() }
  return [...links, normalizeLink(linkWithId)]
}

/**
 * Removes a link at the specified index and returns a new array
 */
export function removeLinkFromArray(links: Link[], index: number): Link[] {
  return links.filter((_, i) => i !== index)
}

/**
 * Validates and normalizes all links in an array
 * Returns { validLinks, hasErrors, errorCount }
 */
export function processLinksForSave(
  links: Link[],
  validateFn: (link: Link, allLinks: Link[], index: number) => { isValid: boolean; error?: string },
): { validLinks: Link[]; hasErrors: boolean; errorCount: number } {
  let hasErrors = false
  let errorCount = 0
  const validLinks: Link[] = []

  for (let i = 0; i < links.length; i++) {
    const link = links[i]
    const validation = validateFn(link, links, i)

    if (validation.isValid) {
      validLinks.push(normalizeLink(link))
    } else {
      hasErrors = true
      errorCount++
      link.error = validation.error
      link.hasError = true
    }
  }

  return { errorCount, hasErrors, validLinks }
}
