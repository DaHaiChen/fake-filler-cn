import type { ElementFillerSession } from '../types'
import { setNativeInputValue } from '../shared/native-input'

/**
 * Element Plus 时间类编辑器（`el-date-editor--time`）填入 `HH:mm:ss`。
 */
function isElementPlusTimeOnlyEditor(editor: HTMLElement): boolean {
    return editor.classList.contains('el-date-editor--time')
}

/**
 * 日期时间组合（如 `el-date-editor--datetime`）。
 */
function isElementPlusDateTimeEditor(editor: HTMLElement): boolean {
    return editor.classList.contains('el-date-editor--datetime') || editor.classList.contains('el-date-editor--datetimerange')
}

/**
 * 填充 Element Plus 日期/时间编辑器（`.el-date-editor`）。
 * @param editor 组件根节点
 */
export function fillElementPlusDateEditor(editor: HTMLElement, session: ElementFillerSession): void {
    const inputs = Array.from(editor.querySelectorAll('input')) as HTMLInputElement[]
    if (inputs.length === 0) return

    const g = session.generator

    const hms = g.fillClockTimeHms()
    const buildValue = (_input: HTMLInputElement, index: number): string => {
        if (isElementPlusTimeOnlyEditor(editor)) {
            return hms
        }
        if (editor.classList.contains('el-date-editor--daterange') || editor.classList.contains('el-date-editor--datetimerange')) {
            if (isElementPlusDateTimeEditor(editor)) {
                return index === 0 ? `${g.dateInCurrentMonth()} ${hms}` : `${g.dateInCurrentMonth()} ${hms}`
            }
            return g.dateInCurrentMonth()
        }
        if (isElementPlusDateTimeEditor(editor)) {
            return `${g.dateInCurrentMonth()} ${hms}`
        }
        return g.dateInCurrentMonth()
    }

    inputs.forEach((input, index) => {
        const value = buildValue(input, index)
        setNativeInputValue(input, value)
        input.setAttribute('title', value)
        input.setAttribute('data-value', value)
    })

    const primary = inputs[0]
    const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
    })
    primary.dispatchEvent(inputEvent)

    const changeEvent = new Event('change', { bubbles: true })
    primary.dispatchEvent(changeEvent)

    primary.blur()
}
