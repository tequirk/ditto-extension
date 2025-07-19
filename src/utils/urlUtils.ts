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
