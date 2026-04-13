import type { ElementFillerSession } from '../types'
import { setNativeInputValue } from '../shared/native-input'

/**
 * 需点「确定」的 TimePicker / showTime：浮层多为 Portal 异步挂载，首帧常点不到 OK；
 * 多时刻重试写入 + 点确定，避免「必须先手选一次插件才生效」。
 */
const NEED_CONFIRM_OK_RETRY_DELAYS_MS = [0, 48, 120, 220, 380, 520] as const

/**
 * 判断是否为「仅时间」的 Ant Design TimePicker（根节点带 `ant-picker-time`）。
 */
function isAntTimeOnlyPicker(picker: HTMLElement): boolean {
    return picker.classList.contains('ant-picker-time')
}

/**
 * 判断占位或类名是否暗示「日期 + 时间」单框。
 */
function looksLikeDateTimeInput(input: HTMLInputElement): boolean {
    const ph = (input.getAttribute('placeholder') || '').toLowerCase()
    if (/\d{1,2}:\d{2}/.test(ph) && (ph.includes('年') || ph.includes('-') || ph.includes('/'))) return true
    if (ph.includes('时间') && (ph.includes('日期') || ph.includes('date'))) return true
    return false
}

interface CommitVcPickerOptions {
    /** 为 false 时不 blur（用于 Range 先填起始再填结束，避免中途关闭浮层） */
    blur?: boolean
    /**
     * TimePicker / DatePicker showTime 时 vc-picker 的 `needConfirmButton` 为 true，`blurToCancel` 会为 true。
     * 此时若再 `input.blur()`，会走 `onCancel` 把刚输入的值清掉。此类场景禁止 blur，并点击浮层「确定」。
     */
    needConfirm?: boolean
    /**
     * 当前 `.ant-picker` 根节点；用于在多个浮层并存时匹配最近的 `.ant-picker-dropdown`，并重试直到 Portal 挂载完成。
     */
    pickerRoot?: HTMLElement | null
}

/**
 * 取与触发器位置接近的、已显示的日期/时间浮层（Portal 挂在 body 下，需用几何关系关联）。
 */
function listVisiblePickerDropdownsNearRoot(pickerRoot: HTMLElement | null): HTMLElement[] {
    const out: HTMLElement[] = []
    const pr = pickerRoot?.getBoundingClientRect()
    document.querySelectorAll('.ant-picker-dropdown').forEach(dd => {
        const el = dd as HTMLElement
        if (window.getComputedStyle(el).display === 'none') return
        if (!pr) {
            out.push(el)
            return
        }
        const dr = el.getBoundingClientRect()
        const dy = dr.top - pr.bottom
        const cx = dr.left + dr.width / 2 - (pr.left + pr.width / 2)
        if (dy > -24 && dy < 420 && Math.abs(cx) < 240) {
            out.push(el)
        }
    })
    return out
}

function hasVisiblePickerDropdownNearRoot(pickerRoot: HTMLElement | null): boolean {
    return listVisiblePickerDropdownsNearRoot(pickerRoot).length > 0
}

/**
 * 点击与 `pickerRoot` 对应的可见浮层内的「确定」；若无几何匹配则退化为任意可见浮层。
 */
function tryClickAntPickerOkNearRoot(pickerRoot: HTMLElement | null): boolean {
    let candidates = listVisiblePickerDropdownsNearRoot(pickerRoot)
    if (candidates.length === 0) {
        document.querySelectorAll('.ant-picker-dropdown').forEach(dd => {
            const el = dd as HTMLElement
            if (window.getComputedStyle(el).display !== 'none') {
                candidates.push(el)
            }
        })
    }
    for (const root of candidates) {
        const okBtn = root.querySelector('.ant-picker-ok button:not([disabled])') as HTMLButtonElement | null
        if (okBtn) {
            okBtn.click()
            return true
        }
    }
    return false
}

/**
 * 点击与 `pickerRoot` 对应浮层内的「此刻 / 今天」：TimePicker 多为 `.ant-picker-today-btn`，少数版本为 `.ant-picker-now-btn`。
 * @param pickerRoot 当前 `.ant-picker` 根节点
 * @returns 是否找到并触发点击
 */
function tryClickAntPickerTodayOrNowNearRoot(pickerRoot: HTMLElement | null): boolean {
    let candidates = listVisiblePickerDropdownsNearRoot(pickerRoot)
    if (candidates.length === 0) {
        document.querySelectorAll('.ant-picker-dropdown').forEach(dd => {
            const el = dd as HTMLElement
            if (window.getComputedStyle(el).display !== 'none') {
                candidates.push(el)
            }
        })
    }
    for (const root of candidates) {
        const btn =
            (root.querySelector('.ant-picker-today-btn') as HTMLElement | null)
            ?? (root.querySelector('.ant-picker-now-btn') as HTMLElement | null)
        if (btn) {
            btn.click()
            return true
        }
    }
    return false
}

/**
 * 是否与 vc-picker 的 `needConfirmButton` 一致（时间选择、日期+时间）。
 * @param picker `.ant-picker` 根节点
 * @param filledValue 即将写入的字符串
 */
function isAntPickerNeedConfirmMode(picker: HTMLElement, filledValue: string): boolean {
    if (isAntTimeOnlyPicker(picker)) return true
    const v = filledValue.trim()
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(v)) return true
    if (/\d{4}-\d{2}-\d{2}\s+\d{1,2}:\d{2}/.test(v)) return true
    return false
}

function dispatchOpenPickerInput(input: HTMLInputElement): void {
    input.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }))
    input.focus()
}

/**
 * 写入 input 并派发 Enter，驱动 vc-picker 的 `onTextChange` / `onSubmit`。
 */
function applyVcPickerTextAndEnter(input: HTMLInputElement, value: string): void {
    setNativeInputValue(input, value)
    input.dispatchEvent(
        new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            data: value,
            inputType: 'insertFromPaste',
        }),
    )
    input.dispatchEvent(
        new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
        }),
    )
}

/**
 * 在多个时刻重试：必要时再次打开浮层、同步文本、点确定，直到成功或耗尽次数。
 */
function scheduleNeedConfirmCommit(input: HTMLInputElement, value: string, pickerRoot: HTMLElement | null): void {
    let done = false
    NEED_CONFIRM_OK_RETRY_DELAYS_MS.forEach((delayMs, index) => {
        window.setTimeout(() => {
            if (done) return
            if (index > 0 && !hasVisiblePickerDropdownNearRoot(pickerRoot)) {
                dispatchOpenPickerInput(input)
            }
            applyVcPickerTextAndEnter(input, value)
            if (tryClickAntPickerOkNearRoot(pickerRoot)) {
                done = true
            }
        }, delayMs)
    })
}

/**
 * TimePicker：不依赖手动输入时分，打开浮层后点「此刻/今天」再点「确定」，与真实用户操作一致。
 * @param input 触发器内的 input
 * @param pickerRoot `.ant-picker` 根节点
 */
function scheduleTimePickerCommitViaTodayButton(input: HTMLInputElement, pickerRoot: HTMLElement | null): void {
    let done = false
    NEED_CONFIRM_OK_RETRY_DELAYS_MS.forEach((delayMs, index) => {
        window.setTimeout(() => {
            if (done) return
            if (index > 0 && !hasVisiblePickerDropdownNearRoot(pickerRoot)) {
                dispatchOpenPickerInput(input)
            }
            const clickedToday = tryClickAntPickerTodayOrNowNearRoot(pickerRoot)
            if (tryClickAntPickerOkNearRoot(pickerRoot)) {
                done = true
                return
            }
            // 仅当确实点过「此刻/今天」且浮层已收起时结束（避免首帧浮层未挂载时误判）
            if (clickedToday && !hasVisiblePickerDropdownNearRoot(pickerRoot)) {
                done = true
            }
        }, delayMs)
    })
}

/**
 * vc-picker（Ant Design Vue DatePicker 底层）用受控 `value` 绑定 input，且 `readonly` 在「非输入态」为 true。
 * 仅 `setNativeInputValue` + `input` 往往无法触发 `onSubmit`/`triggerChange`：需 mousedown 打开面板、
 * 再派发带 `data` 的 `input` 与 `Enter`（与 `vc-picker/hooks/usePickerInput` 一致）。
 * @param input 可见 input
 * @param value 与当前 picker 格式一致的字符串
 */
function commitVcPickerInputValue(input: HTMLInputElement, value: string, options: CommitVcPickerOptions = {}): void {
    const { blur = true, needConfirm = false, pickerRoot: pickerRootOpt } = options
    const pickerRoot = pickerRootOpt ?? (input.closest('.ant-picker') as HTMLElement | null)

    dispatchOpenPickerInput(input)

    if (needConfirm) {
        scheduleNeedConfirmCommit(input, value, pickerRoot)
        return
    }

    applyVcPickerTextAndEnter(input, value)

    if (blur) {
        input.blur()
    }
}

/**
 * 填充 Ant Design `DatePicker` / `TimePicker` / `RangePicker` 等（根节点含 `.ant-picker`）。
 * 纯 TimePicker：打开面板后点击 `.ant-picker-today-btn`（或 `.ant-picker-now-btn`）再确定；其余日期为本月随机日，带时间日期框用固定 `12:00:00`。
 * @param picker 组件根节点
 */
export function fillAntDesignDatePicker(picker: HTMLElement, session: ElementFillerSession): void {
    const inputs = Array.from(picker.querySelectorAll('input')) as HTMLInputElement[]
    if (inputs.length === 0) return

    const g = session.generator

    const hms = g.fillClockTimeHms()
    const buildValue = (input: HTMLInputElement, index: number): string => {
        if (isAntTimeOnlyPicker(picker)) {
            return hms
        }
        if (picker.classList.contains('ant-picker-range')) {
            return index === 0 ? g.dateInCurrentMonth() : g.dateInCurrentMonth()
        }
        if (looksLikeDateTimeInput(input)) {
            return `${g.dateInCurrentMonth()} ${hms}`
        }
        return g.dateInCurrentMonth()
    }

    inputs.forEach((input, index) => {
        if (isAntTimeOnlyPicker(picker)) return
        const value = buildValue(input, index)
        setNativeInputValue(input, value)
        input.setAttribute('title', value)
        input.setAttribute('data-value', value)
    })

    const antPicker = picker.closest('.ant-picker')
    if (antPicker && !isAntTimeOnlyPicker(picker)) {
        const firstVal = buildValue(inputs[0], 0)
        try {
            antPicker.setAttribute('data-timestamp', new Date(firstVal.replace(/-/g, '/')).getTime().toString())
        } catch {
            antPicker.setAttribute('data-timestamp', new Date().getTime().toString())
        }
        antPicker.setAttribute('title', firstVal)
    }

    const isRange = picker.classList.contains('ant-picker-range') && inputs.length > 1

    if (isRange && isAntTimeOnlyPicker(picker)) {
        const gapMs = 48
        inputs.forEach((input, index) => {
            window.setTimeout(() => {
                dispatchOpenPickerInput(input)
                scheduleTimePickerCommitViaTodayButton(input, picker)
            }, index * gapMs)
        })
        return
    }

    if (isRange) {
        const gapMs = 48
        inputs.forEach((input, index) => {
            const value = buildValue(input, index)
            const isLast = index === inputs.length - 1
            const needConfirm = isAntPickerNeedConfirmMode(picker, value)
            window.setTimeout(() => {
                commitVcPickerInputValue(input, value, {
                    blur: isLast && !needConfirm,
                    needConfirm,
                    pickerRoot: picker,
                })
            }, index * gapMs)
        })
        return
    }

    const primary = inputs[0]
    if (isAntTimeOnlyPicker(picker)) {
        dispatchOpenPickerInput(primary)
        scheduleTimePickerCommitViaTodayButton(primary, picker)
        return
    }

    const value = buildValue(primary, 0)
    const needConfirm = isAntPickerNeedConfirmMode(picker, value)
    commitVcPickerInputValue(primary, value, {
        blur: !needConfirm,
        needConfirm,
        pickerRoot: picker,
    })
}
