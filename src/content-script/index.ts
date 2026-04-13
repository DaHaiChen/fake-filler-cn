// Content Script
import { ElementFiller } from '../common/element-filler'
import { getOptions } from '../utils/storage'
import type { Options } from '../types'

let filler: ElementFiller | null = null
let initialized = false

// 初始化
async function initialize() {
  try {
    const options = await getOptions()
    filler = new ElementFiller(options)
    initialized = true
    console.log('[中文填表助手] 初始化完成')
  } catch (error) {
    console.error('[中文填表助手] 初始化失败:', error)
  }
}

// 监听来自 background 的消息
chrome.runtime.onMessage.addListener((request: { type: string; clickedElement?: unknown; data?: Options }, _sender: unknown) => {
  // 如果还没有初始化完成，尝试再次获取选项并初始化
  if (!initialized || !filler) {
    initialize().then(() => {
      if (request.type === 'fillAll') {
        filler?.fillAll(document)
      }
    })
    return
  }

  if (request.type === 'fillAll') {
    console.log('[中文填表助手] 填充所有输入')
    filler.fillAll(document)
  } else if (request.type === 'fillForm') {
    const element = request.clickedElement as HTMLElement || document.activeElement as HTMLElement
    if (element) {
      filler.fillForm(element)
    }
  } else if (request.type === 'fillSingle') {
    const element = request.clickedElement as HTMLElement || document.activeElement as HTMLElement
    if (element) {
      filler.fillSingle(element)
    }
  } else if (request.type === 'optionsUpdated' && request.data) {
    filler = new ElementFiller(request.data)
  }
})

// 右键点击记录元素
document.addEventListener('contextmenu', (event) => {
  const target = event.target as HTMLElement
  if (target) {
    chrome.runtime.sendMessage({
      type: 'setClickedElement',
      element: {
        tagName: target.tagName,
        id: target.id,
        name: (target as HTMLInputElement).name || '',
        type: (target as HTMLInputElement).type || '',
      }
    })
  }
})

// 暴露填充方法到全局
;(window as unknown as Record<string, unknown>).fakeFiller = {
  fillAll: () => {
    if (!filler) {
      initialize().then(() => filler?.fillAll(document))
    } else {
      filler.fillAll(document)
    }
  },
  fillForm: (el: HTMLElement) => filler?.fillForm(el),
  fillSingle: (el: HTMLElement) => filler?.fillSingle(el),
}

// 页面加载完成后也尝试填充（如果有表单的话）
document.addEventListener('DOMContentLoaded', () => {
  console.log('[中文填表助手] 页面加载完成')
})

// 立即初始化
initialize()
