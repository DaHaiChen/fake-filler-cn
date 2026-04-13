import type { CustomField, CustomFieldType } from '../../types'
import type { ElementFillerSession, FillableElement } from '../types'
import { fireFillEvents } from '../shared/events'
import { isAnyMatch, isElementVisible } from '../shared/dom'

/**
 * 原生表单控件填充（input / textarea / select / contenteditable）。
 * 依赖会话中的 `generator` 与 `previous*` 字段以实现确认密码、关联邮箱等逻辑。
 */
export class NativeControls {
    constructor(private readonly session: ElementFillerSession) {}

    private fireEvents(element: FillableElement): void {
        fireFillEvents(element, this.session.options.triggerClickEvents)
    }

    private shouldIgnoreElement(element: FillableElement): boolean {
        const ignoreTypes = ['button', 'submit', 'reset', 'file', 'hidden', 'image']
        if (ignoreTypes.includes(element.type)) return true

        if (this.session.options.ignoreHiddenFields && !isElementVisible(element)) return true

        const elementName = this.getElementName(element)
        if (isAnyMatch(elementName, this.session.options.ignoredFields)) return true

        if (this.session.options.ignoreFieldsWithContent) {
            if (element.type !== 'checkbox' && element.type !== 'radio') {
                if (element.value && element.value.trim().length > 0) return true
            }
        }

        return false
    }

    private getElementName(element: FillableElement): string {
        const { fieldMatchSettings: s } = this.session.options
        let name = ''

        if (s.matchName) {
            name += ` ${(element.name || '').toLowerCase()}`
        }
        if (s.matchId) {
            name += ` ${(element.id || '').toLowerCase()}`
        }
        if (s.matchPlaceholder) {
            name += ` ${(element.getAttribute('placeholder') || '').toLowerCase()}`
        }
        if (s.matchLabel) {
            const id = element.id ? element.id.replace(/'/g, "\\'") : ''
            if (id) {
                const labels = document.querySelectorAll(`label[for='${id}']`)
                labels.forEach(label => {
                    name += ` ${label.textContent || ''}`
                })
            }
        }
        if (s.matchAriaLabel) {
            name += ` ${(element.getAttribute('aria-label') || '').toLowerCase()}`
        }

        return name
    }

    private getElementMaxLength(element: HTMLInputElement | HTMLTextAreaElement | undefined): number {
        if (element && element.maxLength > 0) {
            return element.maxLength
        }
        return this.session.options.defaultMaxLength
    }

    private generateByType(type: CustomFieldType, customField?: CustomField): string {
        const opts = customField?.options || {}
        const g = this.session.generator

        switch (type) {
            case 'first-name':
                this.session.previousFirstName = g.firstName()
                return this.session.previousFirstName

            case 'last-name':
                this.session.previousLastName = g.lastName()
                return this.session.previousLastName

            case 'full-name':
                this.session.previousFirstName = g.firstName()
                this.session.previousLastName = g.lastName()
                return this.session.previousFirstName + this.session.previousLastName

            case 'username':
                this.session.previousUsername = g.username()
                return this.session.previousUsername

            case 'email': {
                let emailName = ''
                if (this.session.previousUsername) emailName = this.session.previousUsername
                else if (this.session.previousFirstName) emailName = g.toPinyin(this.session.previousFirstName)
                else emailName = g.username()
                return g.email(emailName)
            }

            case 'phone':
                return g.phone()

            case 'company':
                return g.company()

            case 'address':
                return g.address()

            case 'number': {
                const min = opts.min ?? 1
                const max = opts.max ?? 100
                return g.number(min, max)
            }

            case 'date':
                return g.dateInCurrentMonth()

            case 'url':
                return g.url()

            case 'text':
                return g.paragraph(this.getElementMaxLength(undefined))

            case 'randomized-list':
                return g.randomizedList(opts.list || [])

            default:
                return g.paragraph(20)
        }
    }

    private detectFieldType(element: FillableElement): CustomFieldType | null {
        const name = this.getElementName(element).toLowerCase()
        const type = (element as HTMLInputElement).type?.toLowerCase() || ''

        if (type === 'email') return 'email'
        if (type === 'tel') return 'phone'
        if (type === 'url') return 'url'
        if (type === 'number') return 'number'
        if (type === 'date') return 'date'

        const role = element.getAttribute('role')
        if (role === 'spinbutton') return 'number'

        if (/^(first-?name|fname|名|姓)$/.test(name)) return 'first-name'
        if (/^(last-?name|lname|surname|姓)$/.test(name)) return 'last-name'
        if (/^(full-?name|name|姓名)$/.test(name)) return 'full-name'
        if (/^(user-?name|账号|用户名)$/.test(name)) return 'username'
        if (/^(e-?mail|邮箱|电子邮件)$/.test(name)) return 'email'
        if (/^(phone|tel|mobile|电话|手机|mobil)$/.test(name)) return 'phone'
        if (/^(company|org|单位|公司|企业)$/.test(name)) return 'company'
        if (/^(address|addr|地址)$/.test(name)) return 'address'
        if (/^(number|num|qty|数量|金额|价格)$/.test(name)) return 'number'

        return null
    }

    private getNumberRange(element: FillableElement): { min: number; max: number } {
        const min = element.getAttribute('aria-valuemin')
        const max = element.getAttribute('aria-valuemax')
        return {
            min: min ? parseInt(min) : 0,
            max: max ? parseInt(max) : 100,
        }
    }

    private fillInputByType(element: HTMLInputElement): void {
        const g = this.session.generator
        const type = element.type?.toLowerCase() || 'text'

        switch (type) {
            case 'checkbox': {
                const agreeFields = ['agree', 'terms', 'conditions', '同意', '条款', '协议']
                if (isAnyMatch(element.name.toLowerCase(), agreeFields)) {
                    element.checked = true
                } else {
                    element.checked = Math.random() > 0.5
                }
                break
            }

            case 'radio': {
                const radios = document.querySelectorAll(`input[name="${element.name}"]`)
                const unchecked = Array.from(radios).filter(r => !(r as HTMLInputElement).checked) as HTMLInputElement[]
                if (unchecked.length > 0) {
                    const random = unchecked[Math.floor(Math.random() * unchecked.length)]
                    random.checked = true
                    this.fireEvents(random)
                }
                return
            }

            case 'date': {
                element.value = g.dateInCurrentMonth()
                break
            }

            case 'datetime-local': {
                element.value = `${g.dateInCurrentMonth()}T${g.fillClockTimeHms().slice(0, 5)}`
                break
            }

            case 'time': {
                element.value = g.fillClockTimeHms().slice(0, 5)
                break
            }

            case 'number':
            case 'range': {
                const min = element.min ? parseInt(element.min) : 1
                const max = element.max ? parseInt(element.max) : 100
                element.value = String(g.randomNumber(min, max))
                break
            }

            case 'password': {
                if (isAnyMatch(element.name.toLowerCase(), this.session.options.confirmFields)) {
                    element.value = this.session.previousPassword
                } else {
                    if (this.session.options.passwordSettings.mode === 'defined') {
                        this.session.previousPassword = this.session.options.passwordSettings.password
                    } else {
                        this.session.previousPassword = g.password()
                    }
                    element.value = this.session.previousPassword
                }
                break
            }

            case 'email': {
                if (isAnyMatch(element.name.toLowerCase(), this.session.options.confirmFields)) {
                    element.value = this.session.previousValue
                } else {
                    this.session.previousValue = g.email()
                    element.value = this.session.previousValue
                }
                break
            }

            case 'tel': {
                element.value = g.phone()
                break
            }

            case 'url': {
                element.value = g.url()
                break
            }

            case 'color': {
                element.value = g.color()
                break
            }

            case 'search': {
                element.value = g.text(1, 3, 50)
                break
            }

            default: {
                if (element.getAttribute('role') === 'spinbutton') {
                    const range = this.getNumberRange(element)
                    element.value = String(g.randomNumber(range.min, range.max))
                    break
                }
                const detectedType = this.detectFieldType(element)
                if (detectedType) {
                    element.value = this.generateByType(detectedType)
                } else {
                    element.value = g.paragraph(this.getElementMaxLength(element))
                }
            }
        }

        this.fireEvents(element)
    }

    fillInputElement(element: HTMLInputElement): void {
        if (this.shouldIgnoreElement(element)) return
        this.fillInputByType(element)
    }

    fillTextAreaElement(element: HTMLTextAreaElement): void {
        if (this.shouldIgnoreElement(element)) return
        element.value = this.session.generator.paragraph(this.getElementMaxLength(element))
        this.fireEvents(element)
    }

    fillSelectElement(element: HTMLSelectElement): void {
        if (this.shouldIgnoreElement(element)) return
        if (!element.options || element.options.length < 1) return

        const skipFirst = !element.options[0].value
        const startIndex = skipFirst ? 1 : 0
        const endIndex = element.options.length - 1

        if (startIndex > endIndex) return

        const randomIndex = Math.floor(Math.random() * (endIndex - startIndex + 1)) + startIndex
        if (!element.options[randomIndex].disabled) {
            element.options[randomIndex].selected = true
            this.fireEvents(element)
        }
    }

    fillContentEditableElement(element: HTMLElement): void {
        if (element.isContentEditable) {
            element.textContent = this.session.generator.paragraph(this.getElementMaxLength(undefined))
        }
    }
}
