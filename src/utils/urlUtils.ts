/**
 * Utility functions for working with URLs
 */

const DEFAULT_DOMAIN = 'example.com'
const FAVICON_BASE_URL = 'https://www.google.com/s2/favicons?domain='

/**
 * Extracts domain from a URL string
 */
export function getDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return DEFAULT_DOMAIN
  }
}

/**
 * Gets the favicon URL for a given domain
 */
export function getFaviconUrl(domain: string): string {
  return `${FAVICON_BASE_URL}${domain}`
}

/**
 * Gets the default favicon URL
 */
export function getDefaultFaviconUrl(): string {
  return getFaviconUrl(DEFAULT_DOMAIN)
}

/**
 * Automatically adds https:// to a URL if it doesn't have a protocol
 */
export function formatUrl(url: string): string {
  const trimmedUrl = url.trim()

  // Return empty string as-is
  if (!trimmedUrl) {
    return trimmedUrl
  }

  // Check if URL already has a protocol
  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl
  }

  // Add https:// if URL appears to be a valid domain
  // Simple check for domain-like patterns
  if (
    /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/.test(
      trimmedUrl,
    )
  ) {
    return `https://${trimmedUrl}`
  }

  // Return as-is if it doesn't look like a valid domain
  return trimmedUrl
}
