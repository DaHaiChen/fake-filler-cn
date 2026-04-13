/**
 * 使用 `HTMLInputElement` 原型上的 `value` setter 写入，便于 React/Vue 受控组件同步内部状态。
 * @param input 目标 input
 * @param value 新值
 */
export function setNativeInputValue(input: HTMLInputElement, value: string): void {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
    if (nativeInputValueSetter) {
        nativeInputValueSetter.call(input, value)
    } else {
        input.value = value
    }
}
