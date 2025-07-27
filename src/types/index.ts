export interface Link {
  id: string
  label: string
  url: string
  isCopied?: boolean
  hasError?: boolean
  error?: string
  hasTitleError?: boolean
  hasUrlError?: boolean
}
