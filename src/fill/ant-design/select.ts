import type { ElementFillerSession } from '../types'
import { isNodeVisiblyInteractive } from '../shared/dom'
import { dispatchOpenOverlayClick, retryPickOption, retryPickOptionAsync } from '../shared/open-overlay'

const RETRY_DELAYS_MS = [16, 32, 48, 80, 120, 200, 350, 500]

/** 批量填充时，每个 Select 完成（含重试结束）后再处理下一个的间隔，避免浮层重叠。 */
const SELECT_BATCH_GAP_MS = 300

function delayMs(ms: number): Promise<void> {
    return new Promise(resolve => {
        window.setTimeout(resolve, ms)
    })
}

/**
 * 在已挂载的下拉层中查找第一个可选 Ant Design Select 选项。
 */
function findFirstVisibleAntDesignOption(): HTMLElement | null {
    const dropdowns = document.querySelectorAll('.ant-select-dropdown')
    for (const dd of dropdowns) {
        const root = dd as HTMLElement
        if (window.getComputedStyle(root).display === 'none') continue

        const optionSelectors = [
            '.ant-select-item-option:not(.ant-select-item-option-disabled)',
            '.rc-select-item-option:not(.rc-select-item-option-disabled)',
            '[role="option"]:not([aria-disabled="true"])',
        ].join(', ')

        const options = root.querySelectorAll(optionSelectors)
        for (const node of options) {
            const el = node as HTMLElement
            if (el.getAttribute('aria-disabled') === 'true') continue
            if (!isNodeVisiblyInteractive(el)) continue
            return el
        }
    }

    const fallback = document.querySelector(
        '.ant-select-dropdown .ant-select-item-option:not(.ant-select-item-option-disabled)',
    ) as HTMLElement | null
    if (fallback && isNodeVisiblyInteractive(fallback)) return fallback

    return null
}

function buildTryPick(): () => boolean {
    return (): boolean => {
        const opt = findFirstVisibleAntDesignOption()
        if (!opt) return false
        opt.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 }))
        opt.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, button: 0 }))
        opt.click()
        return true
    }
}

/**
 * 打开 Ant Design Select 并尝试选中第一项（异步，可 await，用于批量串行）。
 * @returns 是否识别为 Select 且已完成一轮打开+重试（成功点到为 true，未点到为 false）
 */
export async function tryFillAntDesignSelectAsync(
    start: HTMLElement,
    _session: ElementFillerSession,
): Promise<boolean> {
    const root = start.closest('.ant-select') as HTMLElement | null
    if (!root || root.classList.contains('ant-select-disabled')) return false

    const selector = root.querySelector('.ant-select-selector') as HTMLElement | null
    if (!selector) return false

    dispatchOpenOverlayClick(selector)
    const picked = await retryPickOptionAsync(buildTryPick(), RETRY_DELAYS_MS)
    return picked
}

/**
 * 从当前节点向上查找 Ant Design `Select`，打开下拉并选中第一个可用项（同步触发，不等待结束）。
 * @param start 点击或聚焦的任意节点
 * @returns 是否识别为 Ant Design Select 并已触发处理
 */
export function tryFillAntDesignSelect(start: HTMLElement, _session: ElementFillerSession): boolean {
    const root = start.closest('.ant-select') as HTMLElement | null
    if (!root || root.classList.contains('ant-select-disabled')) return false

    const selector = root.querySelector('.ant-select-selector') as HTMLElement | null
    if (!selector) return false

    dispatchOpenOverlayClick(selector)
    retryPickOption(buildTryPick(), RETRY_DELAYS_MS)
    return true
}

/**
 * 批量：串行处理每个 Select（前一个选完并等待间隔后再打开下一个），减少「同时多个下拉」导致的失败。
 */
export async function fillAllAntDesignSelectsAsync(
    container: Document | HTMLElement,
    session: ElementFillerSession,
): Promise<void> {
    const roots = Array.from(
        container.querySelectorAll('.ant-select:not(.ant-select-disabled)'),
    ) as HTMLElement[]
    for (const root of roots) {
        await tryFillAntDesignSelectAsync(root, session)
        await delayMs(SELECT_BATCH_GAP_MS)
    }
}

/**
 * 批量处理容器内所有 Ant Design Select（内部串行异步执行，不阻塞 `fillAll` 其余逻辑）。
 */
export function fillAllAntDesignSelects(container: Document | HTMLElement, session: ElementFillerSession): void {
    void fillAllAntDesignSelectsAsync(container, session)
}
