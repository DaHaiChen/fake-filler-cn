// 中文填表助手 - 虚拟数据

// 常见中文姓氏
export const chineseSurnames = [
  '王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴',
  '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗',
  '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧',
  '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕',
  '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎',
  '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜',
  '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆',
  '郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史',
]

// 常见中文名字
export const chineseGivenNames = [
  '伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军',
  '洋', '勇', '艳', '杰', '涛', '明', '超', '秀兰', '霞', '平',
  '刚', '桂英', '芬', '玲', '鹏', '辉', '波', '燕', '华', '飞',
  '红', '云', '梅', '兰', '英', '华', '建军', '志强', '秀珍', '丽丽',
  '浩', '宇', '欣', '怡', '子轩', '梓涵', '一诺', '浩然', '晨曦', '思琪',
  '雨萱', '子墨', '诗涵', '嘉怡', '欣怡', '子涵', '思远', '志远', '子豪', '子涵',
]

// 随机生成中文姓名
export function generateName(): string {
  const surname = chineseSurnames[Math.floor(Math.random() * chineseSurnames.length)]
  const givenName = chineseGivenNames[Math.floor(Math.random() * chineseGivenNames.length)]
  return surname + givenName
}

// 生成姓
export function generateSurname(): string {
  return chineseSurnames[Math.floor(Math.random() * chineseSurnames.length)]
}

// 生成名
export function generateGivenName(): string {
  return chineseGivenNames[Math.floor(Math.random() * chineseGivenNames.length)]
}

// 中国省份
export const provinces = [
  '北京市', '天津市', '上海市', '重庆市',
  '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省',
  '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省',
  '河南省', '湖北省', '湖南省', '广东省', '海南省',
  '四川省', '贵州省', '云南省', '陕西省', '甘肃省', '青海省', '台湾省',
  '内蒙古自治区', '广西壮族自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区',
  '香港特别行政区', '澳门特别行政区',
]

// 城市
export const cities = [
  '北京', '上海', '广州', '深圳', '杭州', '南京', '苏州', '成都', '武汉', '西安',
  '重庆', '天津', '青岛', '长沙', '郑州', '济南', '大连', '沈阳', '哈尔滨', '长春',
  '昆明', '福州', '厦门', '合肥', '南昌', '石家庄', '贵阳', '兰州', '太原', '呼和浩特',
  '乌鲁木齐', '拉萨', '银川', '西宁', '海口', '三亚', '东莞', '佛山', '珠海', '无锡',
  '常州', '宁波', '温州', '绍兴', '嘉兴', '金华', '台州', '扬州', '南通', '徐州',
]

// 区县
export const districts = [
  '朝阳区', '海淀区', '浦东新区', '黄浦区', '天河区', '越秀区', '南山区', '福田区',
  '江岸区', '武昌区', '雁塔区', '碑林区', '锦江区', '青羊区', '武侯区', '西湖区',
  '滨江区', '余杭区', '萧山区', '江干区', '上城区', '下城区', '拱墅区', '西湖区',
  '高新区', '经开区', '新城', '新区', '经济区', '示范区', '工业园', '科技园',
]

// 街道/路名
export const streetNames = [
  '人民路', '中山路', '建设路', '解放路', '文化路', '和平路', '胜利路', '友谊路',
  '长江路', '黄河路', '北京路', '上海路', '南京路', '广州路', '深圳路', '杭州路',
  '科技路', '创新路', '创业路', '工业园路', '学院路', '大学路', '师范路', '医院路',
  '商业街', '步行街', '广场路', '公园路', '花园路', '桂花路', '梅花路', '兰花路',
  '竹园路', '桃园路', '梨园路', '枣园路', '松园路', '柳园路', '槐园路', '杨园路',
]

// 常见小区名
export const communityNames = [
  '阳光花园', '锦绣花园', '绿城花园', '金地花园', '万科城', '保利公园',
  '华润橡树湾', '中海国际', '龙湖时代', '金科天籁', '碧桂园', '恒大名都',
  '绿地中央', '世茂滨江', '融创御锦', '远洋心里', '华侨城', '招商雍华府',
  '金色家园', '银座花园', '紫荆花园', '牡丹园', '玫瑰园', '百合花园',
  '怡景花园', '怡园', '怡居花园', '怡心花园', '怡康花园', '怡乐园',
]

// 国内常用邮箱域名
export const emailDomains = [
  'qq.com', '163.com', '126.com', 'sina.com', 'sina.cn',
  'sohu.com', 'tom.com', 'aliyun.com', 'outlook.com', 'hotmail.com',
  'gmail.com', '139.com', 'wo.cn', '189.cn', 'foxmail.com',
]

// 随机生成邮箱
export function generateEmail(name?: string): string {
  const username = name ? pinyinize(name) : generateRandomUsername()
  const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)]
  return `${username}@${domain}`
}

// 拼音化（简化版）
export function pinyinize(chinese: string): string {
  // 简化处理：直接返回拼音首字母或简单转换
  const pinyinMap: Record<string, string> = {
    '张': 'zhang', '李': 'li', '王': 'wang', '刘': 'liu', '陈': 'chen',
    '杨': 'yang', '赵': 'zhao', '黄': 'huang', '周': 'zhou', '吴': 'wu',
    '徐': 'xu', '孙': 'sun', '胡': 'hu', '朱': 'zhu', '高': 'gao',
    '林': 'lin', '何': 'he', '郭': 'guo', '马': 'ma', '罗': 'luo',
    '伟': 'wei', '芳': 'fang', '娜': 'na', '秀': 'xiu', '英': 'ying',
    '敏': 'min', '静': 'jing', '丽': 'li', '强': 'qiang', '磊': 'lei',
    '军': 'jun', '洋': 'yang', '勇': 'yong', '艳': 'yan', '杰': 'jie',
    '涛': 'tao', '明': 'ming', '超': 'chao', '平': 'ping', '刚': 'gang',
  }

  let result = ''
  for (const char of chinese) {
    result += pinyinMap[char] || char
  }
  return result
}

// 生成随机用户名
export function generateRandomUsername(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  const len = Math.floor(Math.random() * 6) + 5  // 5-10位
  let result = ''
  for (let i = 0; i < len; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

// 生成随机数字
export function randomNumber(min: number, max: number, decimal = 0): number {
  const result = Math.random() * (max - min) + min
  if (decimal > 0) {
    return Number(result.toFixed(decimal))
  }
  return Math.floor(result)
}

// 中国手机号段（主要号段）
export const phonePrefixes = [
  '130', '131', '132', '133', '134', '135', '136', '137', '138', '139',
  '145', '147', '149',
  '150', '151', '152', '153', '155', '156', '157', '158', '159',
  '166',
  '170', '171', '172', '173', '175', '176', '177', '178',
  '180', '181', '182', '183', '184', '185', '186', '187', '188', '189',
  '191', '193', '195', '197', '198', '199',
]

// 生成随机手机号
export function generatePhoneNumber(): string {
  const prefix = phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)]
  const suffix = String(Math.floor(Math.random() * 100000000)).padStart(8, '0')
  return prefix + suffix
}

// 生成固定电话号码
export function generateLandlineNumber(): string {
  const areaCodes: Record<string, string[]> = {
    '010': ['北京'], '021': ['上海'], '020': ['广州'], '0755': ['深圳'],
    '022': ['天津'], '023': ['重庆'], '028': ['成都'], '027': ['武汉'],
    '029': ['西安'], '025': ['南京'], '0571': ['杭州'], '0531': ['济南'],
  }
  const codes = Object.keys(areaCodes)
  const code = codes[Math.floor(Math.random() * codes.length)]
  const number = String(Math.floor(Math.random() * 10000000)).padStart(7, '0')
  return `${code}-${number}`
}

// 公司名称
export const companySuffixes = [
  '科技有限公司', '电子商务有限公司', '网络科技有限公司', '信息技术有限公司',
  '传媒有限公司', '文化传播有限公司', '实业有限公司', '贸易有限公司',
  '进出口有限公司', '制造有限公司', '服饰有限公司', '建材有限公司',
  '汽车销售有限公司', '酒店管理有限公司', '物业管理有限公司', '装饰工程有限公司',
]

// 生成公司名称
export function generateCompanyName(): string {
  const name = generateName()
  const suffix = companySuffixes[Math.floor(Math.random() * companySuffixes.length)]
  return `${name}${suffix}`
}

// 生成中文地址
export function generateAddress(): string {
  const province = provinces[Math.floor(Math.random() * provinces.length)]
  const city = cities[Math.floor(Math.random() * cities.length)]
  const district = districts[Math.floor(Math.random() * districts.length)]
  const street = streetNames[Math.floor(Math.random() * streetNames.length)]
  const number = randomNumber(1, 999)
  const community = Math.random() > 0.5 ? communityNames[Math.floor(Math.random() * communityNames.length)] : ''

  let address = ''
  if (province !== '北京市' && province !== '天津市' && province !== '上海市' && province !== '重庆市') {
    address = province
  }
  address += city + district + street + number + '号'
  if (community) {
    address += ' ' + community
  }
  return address
}

// 生成邮政编码
export function generatePostalCode(): string {
  // 中国邮政编码为6位数字
  const firstTwo = String(randomNumber(10, 99))
  const rest = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return firstTwo + rest
}

// 生成随机文本（中文）
export const chineseWords = [
  '你好', '世界', '中国', '北京', '上海', '广州', '深圳', '杭州', '成都', '武汉',
  '今天', '天气', '很好', '阳光', '明媚', '学习', '工作', '生活', '快乐', '幸福',
  '健康', '平安', '顺利', '成功', '进步', '发展', '创新', '合作', '共赢', '未来',
  '科技', '网络', '信息', '数据', '智能', '人工', '智慧', '数字', '互联', '云端',
]

export function generateChineseText(_minLength: number, _maxLength: number): string {
  const sentences = [
    '很高兴认识你，希望以后多多指教。',
    '这是一个测试文本，用于表单填充功能。',
    '感谢使用中文填表助手，让填表变得简单快捷。',
    '欢迎使用我们的产品，祝您使用愉快。',
    '如有疑问，请联系我们的客服人员。',
    '您的意见对我们非常重要，欢迎提出宝贵建议。',
    '恭喜您完成了注册，请完善您的个人信息。',
    '请仔细阅读以下条款和条件。',
    '我们将尽快处理您的请求，感谢您的耐心等待。',
    '祝您生活愉快，工作顺利！',
  ]
  return sentences[Math.floor(Math.random() * sentences.length)]
}

// 生成短文本
export function generateShortText(): string {
  return chineseWords[Math.floor(Math.random() * chineseWords.length)]
}

// 生成随机ID（身份证号格式，模拟）
export function generateIdNumber(): string {
  const area = String(randomNumber(110000, 659000))
  const year = String(randomNumber(1960, 2005))
  const month = String(randomNumber(1, 12)).padStart(2, '0')
  const day = String(randomNumber(1, 28)).padStart(2, '0')
  const seq = String(randomNumber(100, 999))
  // 校验位用随机数代替
  const check = String(randomNumber(0, 9))
  return area + year + month + day + seq + check
}

// 生成随机密码
export function generatePassword(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)]
  }
  return password
}
