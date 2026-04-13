import type { Options } from '../types'
import { defaultOptions } from '../types'

export async function getOptions(): Promise<Options> {
  const result = await chrome.storage.local.get('options')
  return result.options ?? { ...defaultOptions }
}

export async function saveOptions(options: Options): Promise<void> {
  await chrome.storage.local.set({ options })
}

export async function resetOptions(): Promise<Options> {
  const options = { ...defaultOptions }
  await saveOptions(options)
  return options
}
