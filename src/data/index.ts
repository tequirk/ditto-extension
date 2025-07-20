import * as browser from 'webextension-polyfill'

import type { Link } from '../types'

export async function getLinks() {
  let data = []
  try {
    if (typeof browser !== 'undefined' && browser.storage) {
      const result = await browser.storage.local.get(['urls'])
      if (result.urls && Array.isArray(result.urls)) {
        data = result.urls
      } else {
        data = []
      }
    } else {
      // Fallback for development
      data = []
    }
  } catch (err) {
    console.error('Failed to load links:', err)
    data = []
  }

  return data
}

export async function saveLinks(links: Link[]) {
  try {
    if (typeof browser !== 'undefined' && browser.storage) {
      await browser.storage.local.set({ urls: links })
    } else {
      // Fallback for development
      console.warn('Browser storage not available, skipping save.')
    }
  } catch (err) {
    console.error('Failed to save links:', err)
  }

  return links
}
