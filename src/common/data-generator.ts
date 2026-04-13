import RandExp from 'randexp'
import { format, addDays, subDays, startOfMonth, endOfMonth } from 'date-fns'
import {
  generateName,
  generateSurname,
  generateGivenName,
  generateEmail,
  generatePhoneNumber,
  generateCompanyName,
  generateAddress,
  generatePostalCode,
  generateChineseText,
  generateShortText,
  generateIdNumber,
  generatePassword,
} from './dummy-data'

export class DataGenerator {
  // 随机数
  randomNumber(min: number, max: number, decimalPlaces = 0): number {
    const result = Math.random() * (max - min + 1) + min
    if (decimalPlaces > 0) {
      return Number(result.toFixed(decimalPlaces))
    }
    return Math.floor(result)
  }

  // 随机选择数组元素
  randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  // 生成姓名
  firstName(): string {
    return generateGivenName()
  }

  lastName(): string {
    return generateSurname()
  }

  fullName(): string {
    return generateName()
  }

  // 生成用户名
  username(): string {
    const name = generateName()
    const num = Math.floor(Math.random() * 100)
    return this.randomItem([
      `${name}${num}`,
      `${name}_${num}`,
      `${this.toPinyin(name)}${num}`,
    ])
  }

  // 转换为拼音（简化）
  toPinyin(name: string): string {
    return name.split('').map(c => c.charCodeAt(0) % 26 + 97).map(n => String.fromCharCode(n)).join('')
  }

  // 生成邮箱
  email(name?: string): string {
    return generateEmail(name)
  }

  // 生成电话
  phone(): string {
    return generatePhoneNumber()
  }

  // 生成公司
  company(): string {
    return generateCompanyName()
  }

  // 生成地址
  address(): string {
    return generateAddress()
  }

  // 生成邮编
  postalCode(): string {
    return generatePostalCode()
  }

  // 生成文本
  text(minWords: number, maxWords: number, maxLength: number): string {
    let result = ''
    for (let i = 0; i < this.randomNumber(minWords, maxWords); i++) {
      result += generateShortText()
    }
    if (maxLength > 0 && result.length > maxLength) {
      result = result.substring(0, maxLength)
    }
    return result
  }

  // 生成段落
  paragraph(maxLength: number): string {
    return generateChineseText(0, maxLength)
  }

  // 生成数字
  number(min: number, max: number, decimalPlaces = 0): string {
    return String(this.randomNumber(min, max, decimalPlaces))
  }

  // 生成日期
  date(minDate?: Date, maxDate?: Date): string {
    let date: Date
    if (minDate && maxDate) {
      const range = maxDate.getTime() - minDate.getTime()
      date = new Date(minDate.getTime() + Math.random() * range)
    } else {
      const today = new Date()
      const past = subDays(today, 365 * 30)
      const future = addDays(today, 365)
      date = new Date(past.getTime() + Math.random() * (future.getTime() - past.getTime()))
    }
    return format(date, 'yyyy-MM-dd')
  }

  /**
   * 生成本月内的随机日期（yyyy-MM-dd），用于表单填充，避免跨年跨月的随机日期。
   * @returns 当前自然月内某一天的日期字符串
   */
  dateInCurrentMonth(): string {
    const now = new Date()
    const start = startOfMonth(now)
    const end = endOfMonth(now)
    const t = start.getTime() + Math.random() * (end.getTime() - start.getTime())
    return format(new Date(t), 'yyyy-MM-dd')
  }

  /**
   * 表单填充用固定时刻（HH:mm:ss），与 `dateInCurrentMonth` 搭配，避免随机时分导致面板确认行为不稳定。
   * @returns 固定为中午 12 点整的时分秒
   */
  fillClockTimeHms(): string {
    return '12:00:00'
  }

  // 生成时间
  time(): string {
    const hour = String(this.randomNumber(0, 23)).padStart(2, '0')
    const minute = String(this.randomNumber(0, 59)).padStart(2, '0')
    return `${hour}:${minute}`
  }

  // 生成颜色
  color(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  }

  // 生成网址
  website(): string {
    const words = ['baidu', 'aliyun', 'tencent', 'huawei', 'xiaomi', 'oppo', 'vivo']
    const domains = ['.com', '.cn', '.com.cn', '.net']
    return `https://www.${this.randomItem(words)}${this.randomItem(domains)}`
  }

  // 生成 URL
  url(): string {
    return this.website()
  }

  // 生成密码
  password(length?: number): string {
    return generatePassword(length || 12)
  }

  // 生成身份证
  idNumber(): string {
    return generateIdNumber()
  }

  // 按正则生成
  regex(pattern: string): string {
    try {
      const randexp = new RandExp(pattern)
      randexp.defaultRange.add(0, 65535)
      return randexp.gen()
    } catch {
      return generateShortText()
    }
  }

  // 从列表随机选择
  randomizedList(list: string[]): string {
    if (!list || list.length === 0) return ''
    return this.randomItem(list)
  }

  // alphanumeric 模板替换
  alphanumeric(template: string): string {
    return template.replace(/X/g, () => String(this.randomNumber(1, 9)))
                   .replace(/x/g, () => String(this.randomNumber(0, 9)))
                   .replace(/L/g, () => String.fromCharCode(65 + this.randomNumber(0, 25)))
                   .replace(/l/g, () => String.fromCharCode(97 + this.randomNumber(0, 25)))
  }
}

export default new DataGenerator()
