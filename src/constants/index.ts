/**
 * Application constants
 */

// Timing constants
export const COPY_FEEDBACK_DURATION = 1200 // milliseconds

// Validation error messages
export const VALIDATION_MESSAGES = {
  DUPLICATE_BOTH: 'A link with this title and URL already exists.',
  DUPLICATE_TITLE: 'A link with this title already exists.',
  DUPLICATE_URL: 'A link with this URL already exists.',
  INVALID_URL_FORMAT: 'URL must start with http:// or https://',
  TITLE_REQUIRED: 'A link title is required.',
  URL_REQUIRED: 'A link URL is required.',
} as const

// Default error messages
export const DEFAULT_ERRORS = {
  COPY_FAILED: 'Failed to copy to clipboard',
  INVALID_LINK: 'Invalid link',
  LOAD_FAILED: 'Failed to load links',
  SAVE_FAILED: 'Failed to save links',
} as const

// UI Text constants
export const UI_TEXT = {
  APP_TAGLINE: 'All of your most-used links at-the-ready, in one place.',
  BUY_COFFEE_LINK: 'Buy me a ☕️?',
  BUY_COFFEE_URL: 'https://buymeacoffee.com/natebenson',

  // Buttons
  CANCEL_BUTTON: 'Cancel',
  DONE_BUTTON: 'Done',

  // Empty State
  EMPTY_STATE_ALT: 'Empty state illustration',
  EDIT_LINKS_BUTTON: 'Edit Links',
  GET_STARTED_ARROW_ALT: 'Get started arrow',
  DELETE_ICON: '🗑️',
  GET_STARTED_TEXT: 'Get started!',

  // Alt texts
  FAVICON_ALT: 'favicon',
  LOGO_ALT: 'Ditto Logo',
  NEW_LINK_BUTTON: '+ New Link',
  SAVE_BUTTON: 'Save',

  OPEN_LINK_BUTTON: 'Open Link',

  // Form Labels
  TITLE_LABEL: 'Title',

  // Form Placeholders
  TITLE_PLACEHOLDER: 'ex. My Link',
  URL_LABEL: 'Link URL',
  URL_PLACEHOLDER: 'ex. https://www.example.com/',
} as const
