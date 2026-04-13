<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="page-title mb-0">自定义字段</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        添加字段
      </button>
    </div>

    <p class="text-sm text-gray-500 mb-4">
      自定义字段规则，用于指定特定字段填充什么类型的数据
    </p>

    <!-- 字段列表 -->
    <div class="card">
      <div v-if="store.options.fields.length === 0" class="text-center py-8 text-gray-500">
        暂无自定义字段，点击"添加字段"创建
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="(field, index) in store.options.fields"
          :key="field.id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div class="flex-1">
            <div class="flex items-center space-x-3">
              <span class="font-medium">{{ field.name }}</span>
              <span class="px-2 py-0.5 text-xs rounded bg-primary-100 text-primary-700">
                {{ fieldTypeLabels[field.type] || field.type }}
              </span>
            </div>
            <div class="text-sm text-gray-500 mt-1">
              匹配: {{ field.match.join(', ') }}
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button
              class="p-2 text-gray-500 hover:text-primary-600"
              title="编辑"
              @click="editField(index)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              class="p-2 text-gray-500 hover:text-red-600"
              title="删除"
              @click="deleteField(index)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑模态框 -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showAddModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6">
        <h3 class="text-lg font-semibold mb-4">
          {{ editingIndex !== null ? '编辑字段' : '添加字段' }}
        </h3>

        <div class="space-y-4">
          <div class="form-group">
            <label class="form-label">字段名称</label>
            <input
              v-model="formData.name"
              type="text"
              class="form-input"
              placeholder="如：手机号码"
            />
          </div>

          <div class="form-group">
            <label class="form-label">字段类型</label>
            <select v-model="formData.type" class="form-input">
              <option v-for="(label, value) in fieldTypeLabels" :key="value" :value="value">
                {{ label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">匹配关键词</label>
            <input
              v-model="matchText"
              type="text"
              class="form-input"
              placeholder="用逗号分隔，如：phone,tel,手机"
            />
            <p class="text-xs text-gray-500 mt-1">字段名称、ID、标签中包含这些词时使用此规则</p>
          </div>

          <!-- 数字类型选项 -->
          <template v-if="formData.type === 'number'">
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">最小值</label>
                <input v-model.number="formData.options!.min" type="number" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">最大值</label>
                <input v-model.number="formData.options!.max" type="number" class="form-input" />
              </div>
            </div>
          </template>

          <!-- 随机列表选项 -->
          <template v-if="formData.type === 'randomized-list'">
            <div class="form-group">
              <label class="form-label">选项列表</label>
              <textarea
                v-model="listText"
                class="form-input"
                rows="4"
                placeholder="每行一个选项"
              />
            </div>
          </template>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button class="btn btn-secondary" @click="showAddModal = false">
            取消
          </button>
          <button class="btn btn-primary" @click="saveField">
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useOptionsStore } from '../store'
import type { CustomField } from '../../types'

const emit = defineEmits<{
  save: []
}>()

const store = useOptionsStore()
const showAddModal = ref(false)
const editingIndex = ref<number | null>(null)
const formData = ref<CustomField>({
  id: '',
  type: 'text',
  name: '',
  match: [],
  options: {},
})
const matchText = ref('')
const listText = ref('')

const fieldTypeLabels: Record<string, string> = {
  'text': '文本',
  'first-name': '名',
  'last-name': '姓',
  'full-name': '姓名',
  'email': '邮箱',
  'phone': '电话',
  'company': '公司',
  'address': '地址',
  'number': '数字',
  'date': '日期',
  'url': '网址',
  'randomized-list': '随机列表',
}

function editField(index: number) {
  editingIndex.value = index
  const field = store.options.fields[index]
  formData.value = JSON.parse(JSON.stringify(field))
  matchText.value = field.match.join(', ')
  listText.value = field.options?.list?.join('\n') || ''
  showAddModal.value = true
}

function deleteField(index: number) {
  if (confirm('确定要删除这个字段吗？')) {
    store.deleteField(store.options.fields[index].id)
    emit('save')
  }
}

function saveField() {
  if (!formData.value.name || !formData.value.type) {
    alert('请填写字段名称和类型')
    return
  }

  formData.value.match = matchText.value.split(',').map(s => s.trim()).filter(Boolean)
  if (formData.value.type === 'randomized-list') {
    formData.value.options = { list: listText.value.split('\n').map(s => s.trim()).filter(Boolean) }
  }

  if (editingIndex.value !== null) {
    store.updateField(store.options.fields[editingIndex.value].id, formData.value)
  } else {
    formData.value.id = Date.now().toString()
    store.addField(formData.value)
  }

  showAddModal.value = false
  editingIndex.value = null
  emit('save')
}
</script>
