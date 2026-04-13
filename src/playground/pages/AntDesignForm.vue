<template>
  <div class="playground-card">
    <router-link class="playground-back" to="/">← 返回首页</router-link>
    <h1 class="playground-title">Ant Design Vue 表单</h1>
    <p class="playground-desc">
      包含 Input、Textarea、Select、DatePicker，便于测试扩展中 <code>ant-design</code> 适配器。
    </p>
    <a-form :model="form" layout="vertical">
      <a-form-item label="姓名" name="userName" required>
        <a-input
          v-model:value="form.userName"
          name="userName"
          placeholder="请输入姓名"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="手机号" name="phone">
        <a-input
          v-model:value="form.phone"
          name="phone"
          placeholder="请输入手机号"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input
          v-model:value="form.email"
          name="email"
          type="email"
          placeholder="请输入邮箱"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="城市" name="city">
        <a-select
          v-model:value="form.city"
          placeholder="请选择城市"
          allow-clear
          style="width: 100%"
        >
          <a-select-option value="beijing">北京</a-select-option>
          <a-select-option value="shanghai">上海</a-select-option>
          <a-select-option value="guangzhou">广州</a-select-option>
          <a-select-option value="shenzhen">深圳</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea
          v-model:value="form.remark"
          name="remark"
          :rows="3"
          placeholder="备注信息"
        />
      </a-form-item>
      <a-form-item label="日期" name="date">
        <a-date-picker
          v-model:value="form.date"
          style="width: 100%"
          value-format="YYYY-MM-DD"
          placeholder="选择日期"
          :popup-style="{ zIndex: 5200 }"
          :get-popup-container="getPopupContainer"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

/**
 * 日期面板挂到 body，避免父级 stacking/overflow 影响；z-index 见模板（需高于同页 Element Plus 弹层）。
 */
function getPopupContainer(): HTMLElement {
    return document.body
}

interface AntdDemoForm {
    userName: string
    phone: string
    email: string
    city: string | undefined
    remark: string
    /** 使用 value-format 时绑定为字符串或 null */
    date: string | null
}

const form = reactive<AntdDemoForm>({
    userName: '',
    phone: '',
    email: '',
    city: undefined,
    remark: '',
    date: null,
})
</script>

<style>
/*
 * Playground 同时引入 Element Plus 与 Ant Design 样式时，antd 日期面板默认 z-index 可能低于 el 弹层，
 * 导致点击落在透明层上、无法选日。统一抬高 ant-picker 浮层。
 */
.ant-picker-dropdown {
    z-index: 5200 !important;
}
</style>
