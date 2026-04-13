<template>
  <div>
    <h2 class="page-title">通用设置</h2>

    <!-- 字段匹配设置 -->
    <div class="card">
      <h3 class="card-title">字段匹配设置</h3>
      <p class="text-sm text-gray-500 mb-4">选择填充器在识别表单字段时参考的元素属性</p>

      <div class="space-y-3">
        <label class="flex items-center">
          <input
            v-model="localOptions.fieldMatchSettings.matchName"
            type="checkbox"
            class="form-checkbox"
          />
          <span class="ml-2 text-sm text-gray-700">字段名称 (name)</span>
        </label>
        <label class="flex items-center">
          <input
            v-model="localOptions.fieldMatchSettings.matchId"
            type="checkbox"
            class="form-checkbox"
          />
          <span class="ml-2 text-sm text-gray-700">字段 ID (id)</span>
        </label>
        <label class="flex items-center">
          <input
            v-model="localOptions.fieldMatchSettings.matchLabel"
            type="checkbox"
            class="form-checkbox"
          />
          <span class="ml-2 text-sm text-gray-700">关联标签文字 (label)</span>
        </label>
        <label class="flex items-center">
          <input
            v-model="localOptions.fieldMatchSettings.matchPlaceholder"
            type="checkbox"
            class="form-checkbox"
          />
          <span class="ml-2 text-sm text-gray-700">占位符文字 (placeholder)</span>
        </label>
        <label class="flex items-center">
          <input
            v-model="localOptions.fieldMatchSettings.matchAriaLabel"
            type="checkbox"
            class="form-checkbox"
          />
          <span class="ml-2 text-sm text-gray-700">无障碍标签 (aria-label)</span>
        </label>
      </div>
    </div>

    <!-- 填充行为 -->
    <div class="card">
      <h3 class="card-title">填充行为</h3>

      <div class="space-y-4">
        <div class="form-group">
          <label class="form-label">忽略的字段</label>
          <input
            v-model="ignoredFieldsText"
            type="text"
            class="form-input"
            placeholder="用逗号分隔，如：captcha,hipinputtext"
          />
          <p class="text-xs text-gray-500 mt-1">包含这些关键词的字段不会被填充</p>
        </div>

        <label class="flex items-center">
          <input
            v-model="localOptions.ignoreHiddenFields"
            type="checkbox"
            class="form-checkbox"
          />
          <span class="ml-2 text-sm text-gray-700">忽略隐藏字段</span>
        </label>

        <label class="flex items-center">
          <input
            v-model="localOptions.ignoreFieldsWithContent"
            type="checkbox"
            class="form-checkbox"
          />
          <span class="ml-2 text-sm text-gray-700">跳过已有内容的字段</span>
        </label>

        <label class="flex items-center">
          <input
            v-model="localOptions.triggerClickEvents"
            type="checkbox"
            class="form-checkbox"
          />
          <span class="ml-2 text-sm text-gray-700">触发输入事件（确保表单验证能检测到）</span>
        </label>

        <label class="flex items-center">
          <input
            v-model="localOptions.enableContextMenu"
            type="checkbox"
            class="form-checkbox"
          />
          <span class="ml-2 text-sm text-gray-700">启用右键菜单</span>
        </label>
      </div>
    </div>

    <!-- 密码设置 -->
    <div class="card">
      <h3 class="card-title">密码设置</h3>

      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <label class="flex items-center">
            <input
              v-model="localOptions.passwordSettings.mode"
              type="radio"
              value="random"
              class="form-checkbox"
            />
            <span class="ml-2 text-sm text-gray-700">随机生成</span>
          </label>
          <label class="flex items-center">
            <input
              v-model="localOptions.passwordSettings.mode"
              type="radio"
              value="defined"
              class="form-checkbox"
            />
            <span class="ml-2 text-sm text-gray-700">使用固定密码</span>
          </label>
        </div>

        <div v-if="localOptions.passwordSettings.mode === 'defined'" class="form-group">
          <label class="form-label">固定密码</label>
          <input
            v-model="localOptions.passwordSettings.password"
            type="text"
            class="form-input"
          />
        </div>
      </div>
    </div>

    <!-- 保存按钮 -->
    <div class="flex justify-end space-x-3">
      <button class="btn btn-secondary" @click="handleReset">
        重置
      </button>
      <button class="btn btn-primary" @click="handleSave">
        保存设置
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useOptionsStore } from '../store'
import type { Options } from '../../types'

const emit = defineEmits<{
  save: []
}>()

const store = useOptionsStore()
const localOptions = ref<Options>({ ...store.options })

const ignoredFieldsText = computed({
  get: () => store.options.ignoredFields.join(', '),
  set: (val) => {
    localOptions.value.ignoredFields = val.split(',').map(s => s.trim()).filter(Boolean)
  }
})

watch(() => store.options, (newVal) => {
  localOptions.value = JSON.parse(JSON.stringify(newVal))
}, { deep: true })

function handleSave() {
  Object.assign(store.options, localOptions.value)
  emit('save')
}

function handleReset() {
  if (confirm('确定要重置为默认设置吗？')) {
    localOptions.value = JSON.parse(JSON.stringify(store.options))
  }
}
</script>
