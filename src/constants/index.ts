/**
 * Application constants
 */

// Timing constants
export const COPY_FEEDBACK_DURATION = 1200 // milliseconds

// Validation error messages
export const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: 'A link title is required.',
  URL_REQUIRED: 'A link URL is required.',
  INVALID_URL_FORMAT: 'URL must start with http:// or https://',
  DUPLICATE_TITLE: 'A link with this title already exists.',
  DUPLICATE_URL: 'A link with this URL already exists.',
  DUPLICATE_BOTH: 'A link with this title and URL already exists.',
} as const

// Default error messages
export const DEFAULT_ERRORS = {
  INVALID_LINK: 'Invalid link',
  LOAD_FAILED: 'Failed to load links',
  SAVE_FAILED: 'Failed to save links',
  COPY_FAILED: 'Failed to copy to clipboard',
} as const

// UI Text constants
export const UI_TEXT = {
  APP_TAGLINE: 'All of your most-used links at-the-ready, in one place.',
  BUY_COFFEE_LINK: 'Buy me a ☕️?',
  BUY_COFFEE_URL: 'https://buymeacoffee.com/natebenson',
  LOGO_ALT: 'Ditto Logo',
  
  // Empty State
  EMPTY_STATE_ALT: 'Empty state illustration',
  GET_STARTED_TEXT: 'Get started!',
  GET_STARTED_ARROW_ALT: 'Get started arrow',
  NEW_LINK_BUTTON: '+ New Link',
  
  // Form Labels
  TITLE_LABEL: 'Title',
  URL_LABEL: 'Link URL',
  
  // Form Placeholders
  TITLE_PLACEHOLDER: 'ex. My Link',
  URL_PLACEHOLDER: 'ex. https://www.example.com/',
  
  // Buttons
  CANCEL_BUTTON: 'Cancel',
  SAVE_BUTTON: 'Save',
  DONE_BUTTON: 'Done',
  EDIT_LINKS_BUTTON: 'Edit Links',
  
  // Alt texts
  FAVICON_ALT: 'favicon',
  DELETE_ICON: '🗑️',
} as const
