import type { ElementFillerSession } from './types'
import { NativeControls } from './native'
import { fillAntDesignDatePicker } from './ant-design/date-picker'
import { fillAllAntDesignSelectsAsync, tryFillAntDesignSelect } from './ant-design/select'
import { fillElementPlusDateEditor } from './element-plus/date-picker'
import { fillAllElementPlusSelectsAsync, tryFillElementPlusSelect } from './element-plus/select'

/**
 * Ant Design TimePicker / showTime 等需点「确定」的浮层，若在未提交时被全局 mousedown 关掉，
 * `vc-picker` 会把选中态重置为 `mergedValue`（多为空），表现为「选完时间又没了」。
 * Select 批量填充会立刻派发 pointer/mousedown，故须在日期/时间控件处理完并尽量关浮层后再跑 Select。
 */
const PICKER_SETTLE_BEFORE_SELECT_MS = 280

function delayMs(ms: number): Promise<void> {
    return new Promise(resolve => {
        window.setTimeout(resolve, ms)
    })
}

/** 判断 input 是否位于 `.ant-picker` / `.el-date-editor` 内，避免与组件库日期适配重复填充。 */
function isInsideLibraryDateControl(el: HTMLElement): boolean {
    return Boolean(el.closest('.ant-picker') || el.closest('.el-date-editor'))
}

/**
 * 先串行填完所有 Ant Design Select，再串行填 Element Plus Select，避免两类浮层同时抢焦点。
 */
async function fillAllLibrarySelectsInOrder(
    container: Document | HTMLElement,
    session: ElementFillerSession,
): Promise<void> {
    await fillAllAntDesignSelectsAsync(container, session)
    await fillAllElementPlusSelectsAsync(container, session)
}

/**
 * 填充容器内全部支持的控件：原生控件、Ant Design / Element Plus 日期与 Select（Select 为异步串行批量）。
 * @param container 文档或任意根节点
 * @param session 填充会话（generator、previous* 状态）
 * @param native 原生控件填充实例
 */
export function fillAllOrchestrated(
    container: Document | HTMLElement,
    session: ElementFillerSession,
    native: NativeControls,
): void {
    container.querySelectorAll('input:not(:disabled):not([readonly])').forEach(el => {
        const input = el as HTMLInputElement
        if (isInsideLibraryDateControl(input)) return
        native.fillInputElement(input)
    })
    container.querySelectorAll('textarea:not(:disabled):not([readonly])').forEach(el => {
        native.fillTextAreaElement(el as HTMLTextAreaElement)
    })
    container.querySelectorAll('select:not(:disabled):not([readonly])').forEach(el => {
        native.fillSelectElement(el as HTMLSelectElement)
    })
    container.querySelectorAll('[contenteditable]').forEach(el => {
        native.fillContentEditableElement(el as HTMLElement)
    })

    container.querySelectorAll('.ant-picker').forEach(el => {
        fillAntDesignDatePicker(el as HTMLElement, session)
    })
    container.querySelectorAll('.el-date-editor').forEach(el => {
        fillElementPlusDateEditor(el as HTMLElement, session)
    })

    void (async () => {
        await delayMs(PICKER_SETTLE_BEFORE_SELECT_MS)
        await fillAllLibrarySelectsInOrder(container, session)
    })()
}

/**
 * 单字段填充：优先 `closest` 匹配 Ant Design / Element Plus Select 与日期编辑器，否则按 input/textarea/select/contenteditable 处理。
 */
export function fillSingleOrchestrated(
    element: HTMLElement,
    session: ElementFillerSession,
    native: NativeControls,
): void {
    if (tryFillAntDesignSelect(element, session)) return
    if (tryFillElementPlusSelect(element, session)) return

    const antPicker = element.closest('.ant-picker')
    if (antPicker) {
        fillAntDesignDatePicker(antPicker as HTMLElement, session)
        return
    }
    const elDate = element.closest('.el-date-editor')
    if (elDate) {
        fillElementPlusDateEditor(elDate as HTMLElement, session)
        return
    }

    const tagName = element.tagName.toLowerCase()
    if (tagName === 'input') {
        native.fillInputElement(element as HTMLInputElement)
    } else if (tagName === 'textarea') {
        native.fillTextAreaElement(element as HTMLTextAreaElement)
    } else if (tagName === 'select') {
        native.fillSelectElement(element as HTMLSelectElement)
    } else if (element.isContentEditable) {
        native.fillContentEditableElement(element)
    }
}

/**
 * 在最近祖先 `form` 内执行 `fillAllOrchestrated`；若无 form 则不填充。
 */
export function fillFormOrchestrated(
    element: HTMLElement,
    session: ElementFillerSession,
    native: NativeControls,
): void {
    const form = element.closest('form')
    if (form) {
        fillAllOrchestrated(form, session, native)
    }
}
