import type { FillableElement } from '../types'

/**
 * 根据用户选项依次派发 `input` / `click` / `change` / `blur`，供依赖原生事件的表单与组件库使用。
 * @param element 表单控件
 * @param triggerClickEvents 是否派发（来自扩展选项 `triggerClickEvents`）
 */
export function fireFillEvents(element: FillableElement, triggerClickEvents: boolean): void {
    if (!triggerClickEvents) return
    ;['input', 'click', 'change', 'blur'].forEach(eventType => {
        element.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }))
    })
}
