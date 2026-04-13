import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Options, CustomField } from '../types'
import { defaultOptions } from '../types'
import { getOptions, saveOptions } from '../utils/storage'

export const useOptionsStore = defineStore('options', () => {
  const options = ref<Options>({ ...defaultOptions })
  const loading = ref(false)
  const saving = ref(false)

  async function load() {
    loading.value = true
    try {
      options.value = await getOptions()
    } finally {
      loading.value = false
    }
  }

  async function save() {
    saving.value = true
    try {
      await saveOptions(options.value)
      // 通知 content script 更新
      chrome.runtime.sendMessage({ type: 'optionsUpdated', data: options.value })
    } finally {
      saving.value = false
    }
  }

  async function reset() {
    options.value = { ...defaultOptions }
    await save()
  }

  function addField(field: CustomField) {
    options.value.fields.push(field)
  }

  function updateField(id: string, field: CustomField) {
    const index = options.value.fields.findIndex(f => f.id === id)
    if (index !== -1) {
      options.value.fields[index] = field
    }
  }

  function deleteField(id: string) {
    options.value.fields = options.value.fields.filter(f => f.id !== id)
  }

  function moveField(from: number, to: number) {
    const fields = options.value.fields
    const [moved] = fields.splice(from, 1)
    fields.splice(to, 0, moved)
  }

  return {
    options,
    loading,
    saving,
    load,
    save,
    reset,
    addField,
    updateField,
    deleteField,
    moveField,
  }
})
