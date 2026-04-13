// Background Service Worker
import { getOptions } from '../utils/storage'
import type { Options, ClickedElementInfo } from '../types'

let clickedElement: ClickedElementInfo | null = null

// Toolbar 按钮点击 - 填充所有输入
chrome.action.onClicked.addListener(async (tab: { id?: number }) => {
  if (!tab?.id) return
  chrome.tabs.sendMessage(tab.id, { type: 'fillAll' })
})

// 监听选项更新
chrome.runtime.onMessage.addListener((request: { type: string; data?: Options }) => {
  if (request.type === 'optionsUpdated' && request.data) {
    // 通知 content script 更新
    chrome.runtime.sendMessage({ type: 'optionsUpdated', data: request.data })
  }
  return false
})

// 填充所有输入
chrome.commands.onCommand.addListener(async (command: string) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab?.id) return

  if (command === 'fill_all_inputs') {
    chrome.tabs.sendMessage(tab.id, { type: 'fillAll' })
  } else if (command === 'fill_this_form') {
    chrome.tabs.sendMessage(tab.id, { type: 'fillForm', clickedElement })
  } else if (command === 'fill_this_input') {
    chrome.tabs.sendMessage(tab.id, { type: 'fillSingle', clickedElement })
  }
})

// 右键菜单
chrome.runtime.onInstalled.addListener(async () => {
  const options = await getOptions()

  if (options.enableContextMenu) {
    chrome.contextMenus.create({
      id: 'fill-all',
      title: '填充所有输入框',
      contexts: ['page', 'editable'],
    })
    chrome.contextMenus.create({
      id: 'fill-form',
      title: '填充当前表单',
      contexts: ['editable'],
    })
    chrome.contextMenus.create({
      id: 'fill-input',
      title: '填充当前输入框',
      contexts: ['editable'],
    })
  }
})

chrome.contextMenus.onClicked.addListener((info: { menuItemId: string }, tab?: { id?: number }) => {
  if (!tab?.id) return

  if (info.menuItemId === 'fill-all') {
    chrome.tabs.sendMessage(tab.id, { type: 'fillAll' })
  } else if (info.menuItemId === 'fill-form') {
    chrome.tabs.sendMessage(tab.id, { type: 'fillForm', clickedElement })
  } else if (info.menuItemId === 'fill-input') {
    chrome.tabs.sendMessage(tab.id, { type: 'fillSingle', clickedElement })
  }
})

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request: { type: string }, _sender: unknown, sendResponse: (response?: unknown) => void) => {
  if (request.type === 'getOptions') {
    getOptions().then(options => {
      sendResponse({ options })
    })
    return true
  }
  return false
})

// 监听来自 content script 的点击元素
chrome.runtime.onMessage.addListener((request: { type: string; element?: ClickedElementInfo }) => {
  if (request.type === 'setClickedElement') {
    clickedElement = request.element || null
  }
})
