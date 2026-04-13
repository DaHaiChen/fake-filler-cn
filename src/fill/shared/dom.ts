import type { FillableElement } from '../types'

/**
 * 判断任意 HTMLElement 是否在布局上可见（用于浮层内选项，不仅限于表单控件类型）。
 */
export function isNodeVisiblyInteractive(element: HTMLElement): boolean {
    if (!element.isConnected) return false
    const style = window.getComputedStyle(element)
    if (style.display === 'none' || style.visibility === 'hidden') return false
    if (Number.parseFloat(style.opacity) === 0) return false
    const rect = element.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
}

/** 粗略判断元素是否可见（宽高为 0 或 `visibility:hidden` 视为不可见）。 */
export function isElementVisible(element: FillableElement): boolean {
    if (!element.offsetHeight && !element.offsetWidth) return false
    if (window.getComputedStyle(element).visibility === 'hidden') return false
    return true
}

/** 判断 `haystack` 是否包含任一关键词（大小写不敏感）。 */
export function isAnyMatch(haystack: string, needles: string[]): boolean {
    const lowerHaystack = haystack.toLowerCase()
    return needles.some(needle => lowerHaystack.includes(needle.toLowerCase()))
}
