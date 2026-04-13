// 字段类型
export type CustomFieldType =
  | 'text'
  | 'first-name'
  | 'last-name'
  | 'full-name'
  | 'username'
  | 'email'
  | 'phone'
  | 'number'
  | 'date'
  | 'url'
  | 'address'
  | 'company'
  | 'randomized-list'

// 自定义字段
export interface CustomField {
  id: string
  type: CustomFieldType
  name: string
  match: string[]  // 匹配关键词
  options?: {
    min?: number
    max?: number
    template?: string
    list?: string[]
    minDate?: string
    maxDate?: string
  }
}

// 字段匹配设置
export interface FieldMatchSettings {
  matchName: boolean
  matchId: boolean
  matchLabel: boolean
  matchPlaceholder: boolean
  matchAriaLabel: boolean
}

// 密码设置
export interface PasswordSettings {
  mode: 'defined' | 'random'
  password: string
}

// 完整选项
export interface Options {
  version: number
  fieldMatchSettings: FieldMatchSettings
  passwordSettings: PasswordSettings
  defaultMaxLength: number
  ignoredFields: string[]
  ignoreHiddenFields: boolean
  ignoreFieldsWithContent: boolean
  triggerClickEvents: boolean
  enableContextMenu: boolean
  agreeTermsFields: string[]
  confirmFields: string[]
  fields: CustomField[]
}

// 默认选项
export const defaultOptions: Options = {
  version: 1,
  fieldMatchSettings: {
    matchName: true,
    matchId: true,
    matchLabel: true,
    matchPlaceholder: false,
    matchAriaLabel: true,
  },
  passwordSettings: {
    mode: 'random',
    password: 'Test@123456',
  },
  defaultMaxLength: 50,
  ignoredFields: ['captcha', 'hipinputtext'],
  ignoreHiddenFields: true,
  ignoreFieldsWithContent: false,
  triggerClickEvents: true,
  enableContextMenu: true,
  agreeTermsFields: ['agree', 'terms', 'conditions', '同意'],
  confirmFields: ['confirm', 'reenter', 'retype', 'repeat', 'confirm', '确认'],
  fields: [],
}

// 消息类型
export interface MessageRequest {
  type: 'fillAll' | 'fillForm' | 'fillSingle' | 'optionsUpdated' | 'getOptions' | 'setClickedElement'
  data?: Options
  element?: ClickedElementInfo
  clickedElement?: ClickedElementInfo
}

// 点击元素信息（可序列化）
export interface ClickedElementInfo {
  tagName: string
  id: string
  name: string
  type: string
}
