/**
 * 模拟用户点击打开下拉/浮层（部分组件库仅 `click()` 不足以展开）。
 * @param trigger 触发器节点（如 Select 的 selector）
 */
export function dispatchOpenOverlayClick(trigger: HTMLElement): void {
    try {
        trigger.focus()
    } catch {
        // 部分节点不可 focus，忽略
    }
    const common = { bubbles: true, cancelable: true, view: window }
    trigger.dispatchEvent(new PointerEvent('pointerdown', { ...common, pointerId: 1, pointerType: 'mouse' }))
    trigger.dispatchEvent(new MouseEvent('mousedown', { ...common, button: 0, buttons: 1 }))
    trigger.dispatchEvent(new MouseEvent('mouseup', { ...common, button: 0, buttons: 0 }))
    trigger.dispatchEvent(new MouseEvent('click', { ...common, button: 0 }))
}

/**
 * 在 `requestAnimationFrame` 后尝试，再按 `delaysMs` 间隔重试，直到 `tryPick` 成功或次数用尽。
 * @param tryPick 尝试选中并返回是否已成功
 * @param delaysMs 每次重试前的等待毫秒（例如 `[16, 32, 64, 120, 200, 400]`）
 */
export function retryPickOption(tryPick: () => boolean, delaysMs: number[]): void {
    void retryPickOptionAsync(tryPick, delaysMs)
}

/**
 * 与 {@link retryPickOption} 相同策略，但以 Promise 结束，便于批量时「选完一个再选下一个」。
 * @returns 是否在重试用尽前成功点到选项
 */
export function retryPickOptionAsync(tryPick: () => boolean, delaysMs: number[]): Promise<boolean> {
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            if (tryPick()) {
                resolve(true)
                return
            }
            let index = 0
            const schedule = (): void => {
                if (index >= delaysMs.length) {
                    resolve(false)
                    return
                }
                const delay = delaysMs[index]
                index += 1
                window.setTimeout(() => {
                    if (tryPick()) {
                        resolve(true)
                        return
                    }
                    schedule()
                }, delay)
            }
            schedule()
        })
    })
}
