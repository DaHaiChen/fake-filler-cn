# 表单库兼容清单（Ant Design / Element Plus）

本文档与 [src/fill/](../src/fill/) 目录约定一致，用于按条推进适配并在合并前勾选状态。

## 目录说明

| 路径 | 职责 |
|------|------|
| [src/fill/orchestrator.ts](../src/fill/orchestrator.ts) | `fillAll` / `fillForm` / `fillSingle` 编排：优先匹配组件库容器，再回退原生控件 |
| [src/fill/native/](../src/fill/native/) | 原生 `input` / `textarea` / `select` / `contenteditable` 填充逻辑 |
| [src/fill/shared/](../src/fill/shared/) | 原生 value setter、事件派发、DOM 工具（避免在 antd / element-plus 中复制粘贴） |
| [src/fill/ant-design/](../src/fill/ant-design/) | Ant Design 按组件族拆分，每文件导出 `tryFill*` |
| [src/fill/element-plus/](../src/fill/element-plus/) | Element Plus 同上 |
| [src/common/element-filler.ts](../src/common/element-filler.ts) | `ElementFiller` 对外 API，内部委托 `fill/` 模块 |

## 兼容策略分级

- **A**：内部多为原生控件或只读 input，较易模拟（优先打通）。
- **B**：需打开浮层再选选项或结构差异大（Select、Cascader 等）。
- **C**：强交互或浏览器安全限制（Upload 真实文件、复杂 Slider 等），可后置或仅「尽力而为」。

## 里程碑

- [x] **M1**：`src/fill/` 目录与编排器落地，原生逻辑迁入 `fill/native`。
- [x] **M2**：`fillSingle` 支持从点击目标 `closest` 解析 `.ant-*` / `.el-*` 容器并分发到适配器。
- [ ] **M3**：`fillAll` 对 B 类组件覆盖与去重策略完善（Select 批量打开可能与页面交互冲突，需按需收敛或配置项）。

## Ant Design（表单相关）

> 状态：`- [ ]` 未开始 / `- [x]` 完成。备注请写测试过的 **antd 大版本** 与限制。

### A 类

| 组件 | 状态 | 备注 |
|------|------|------|
| Input / TextArea / Password / Search | - [ ] | |
| InputNumber | - [ ] | |
| Checkbox / Checkbox.Group | - [ ] | |
| Radio / Radio.Group | - [ ] | |
| Switch | - [ ] | |
| DatePicker（单面板） | - [x] | 初版见 `ant-design/date-picker.ts` |

### B 类

| 组件 | 状态 | 备注 |
|------|------|------|
| Select（含多选、tags） | - [x] | 初版见 `ant-design/select.ts`（打开并选首项；多选/tags 待细化） |
| AutoComplete | - [ ] | |
| Cascader | - [ ] | |
| TreeSelect | - [ ] | |
| DatePicker.RangePicker / TimePicker / 周月季年等 | - [ ] | DOM 不同可拆子任务 |
| Mentions | - [ ] | |

### C 类 / 受限

| 组件 | 状态 | 备注 |
|------|------|------|
| Slider | - [ ] | |
| Rate | - [ ] | |
| ColorPicker | - [ ] | |
| Transfer | - [ ] | |
| Upload | - [ ] | 无法绕过用户选择真实文件；仅辅助或标注不保证 |
| Form | - [ ] | 非控件，无需「填充」 |

## Element Plus（表单相关）

> 备注请写测试过的 **element-plus 版本**。

### A 类

| 组件 | 状态 | 备注 |
|------|------|------|
| Input / Textarea 等 | - [ ] | |
| InputNumber | - [ ] | |
| Checkbox / CheckboxGroup | - [ ] | |
| Radio / RadioGroup | - [ ] | |
| Switch | - [ ] | |
| DatePicker / DateTimePicker | - [x] | 初版见 `element-plus/date-picker.ts` |

### B 类

| 组件 | 状态 | 备注 |
|------|------|------|
| Select / SelectV2 | - [x] | 初版见 `element-plus/select.ts`（打开并选首项） |
| Autocomplete | - [ ] | |
| Cascader | - [ ] | |
| TreeSelect | - [ ] | |
| TimePicker / TimeSelect | - [ ] | |
| Mention | - [ ] | 若使用 |

### C 类 / 受限

| 组件 | 状态 | 备注 |
|------|------|------|
| Slider | - [ ] | |
| Rate | - [ ] | |
| ColorPicker | - [ ] | |
| Transfer | - [ ] | |
| Upload | - [ ] | 同上 |

## 验收建议（每条任务）

1. 在对应 UI 库官方文档示例页或最小 demo 页验证「填充后表单可提交 / 不破坏校验」。
2. 在本表勾选状态并更新备注（版本、已知限制）。
