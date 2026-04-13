import type { ElementFillerSession } from '../types'
import { isNodeVisiblyInteractive } from '../shared/dom'
import { dispatchOpenOverlayClick, retryPickOption, retryPickOptionAsync } from '../shared/open-overlay'

const RETRY_DELAYS_MS = [16, 32, 48, 80, 120, 200, 350, 500]

const SELECT_BATCH_GAP_MS = 300

function delayMs(ms: number): Promise<void> {
    return new Promise(resolve => {
        window.setTimeout(resolve, ms)
    })
}

/**
 * 查找当前可见的 Element Plus 下拉中的第一个可选项。
 */
function findFirstVisibleElementPlusOption(): HTMLElement | null {
    const poppers = document.querySelectorAll(
        '.el-select__popper.el-popper, .el-popper.el-select__popper, .el-select-dropdown.el-popper',
    )
    for (const p of poppers) {
        const el = p as HTMLElement
        if (window.getComputedStyle(el).display === 'none') continue
        if (window.getComputedStyle(el).visibility === 'hidden') continue

        const items = el.querySelectorAll(
            '.el-select-dropdown__item:not(.is-disabled), .el-option:not(.is-disabled), li[role="option"]:not([aria-disabled="true"])',
        )
        for (const node of items) {
            const opt = node as HTMLElement
            if (opt.classList.contains('is-disabled')) continue
            if (!isNodeVisiblyInteractive(opt)) continue
            return opt
        }
    }

    const loose = document.querySelector(
        '.el-select-dropdown .el-select-dropdown__item:not(.is-disabled), .el-popper .el-option:not(.is-disabled)',
    ) as HTMLElement | null
    if (loose && isNodeVisiblyInteractive(loose)) return loose

    return null
}

function buildTryPick(): () => boolean {
    return (): boolean => {
        const opt = findFirstVisibleElementPlusOption()
        if (!opt) return false
        opt.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 }))
        opt.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, button: 0 }))
        opt.click()
        return true
    }
}

/**
 * 打开 Element Plus Select 并尝试选中第一项（异步，可 await）。
 * @returns 是否成功点到选项
 */
export async function tryFillElementPlusSelectAsync(
    start: HTMLElement,
    _session: ElementFillerSession,
): Promise<boolean> {
    const root = start.closest('.el-select') as HTMLElement | null
    if (!root || root.classList.contains('is-disabled')) return false

    const trigger =
        (root.querySelector('.el-select__wrapper') as HTMLElement | null)
        ?? (root.querySelector('.el-input__wrapper') as HTMLElement | null)
        ?? (root.querySelector('.el-select .el-input') as HTMLElement | null)
    if (!trigger) return false

    dispatchOpenOverlayClick(trigger)
    return retryPickOptionAsync(buildTryPick(), RETRY_DELAYS_MS)
}

/**
 * 从当前节点向上查找 Element Plus `Select`，打开下拉并选中第一个可用项。
 * @param start 点击或聚焦的任意节点
 * @returns 是否识别为 Element Plus Select 并已触发处理
 */
export function tryFillElementPlusSelect(start: HTMLElement, _session: ElementFillerSession): boolean {
    const root = start.closest('.el-select') as HTMLElement | null
    if (!root || root.classList.contains('is-disabled')) return false

    const trigger =
        (root.querySelector('.el-select__wrapper') as HTMLElement | null)
        ?? (root.querySelector('.el-input__wrapper') as HTMLElement | null)
        ?? (root.querySelector('.el-select .el-input') as HTMLElement | null)
    if (!trigger) return false

    dispatchOpenOverlayClick(trigger)
    retryPickOption(buildTryPick(), RETRY_DELAYS_MS)
    return true
}

/**
 * 批量：串行处理每个 Element Plus Select。
 */
export async function fillAllElementPlusSelectsAsync(
    container: Document | HTMLElement,
    session: ElementFillerSession,
): Promise<void> {
    const roots = Array.from(container.querySelectorAll('.el-select:not(.is-disabled)')) as HTMLElement[]
    for (const root of roots) {
        await tryFillElementPlusSelectAsync(root, session)
        await delayMs(SELECT_BATCH_GAP_MS)
    }
}

/**
 * 批量处理容器内所有 Element Plus Select（内部串行异步执行）。
 */
export function fillAllElementPlusSelects(container: Document | HTMLElement, session: ElementFillerSession): void {
    void fillAllElementPlusSelectsAsync(container, session)
}
