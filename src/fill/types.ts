import type { Options } from '../types'
import dataGenerator from '../common/data-generator'

/** 与一次填充会话绑定的可变状态（确认邮箱/密码等） */
export interface ElementFillerSession {
    options: Options
    generator: typeof dataGenerator
    previousValue: string
    previousPassword: string
    previousUsername: string
    previousFirstName: string
    previousLastName: string
}

export type FillableElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
