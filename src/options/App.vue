<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-8">
            <h1 class="text-xl font-bold text-primary-600">中文填表助手</h1>
            <div class="flex space-x-1">
              <button
                v-for="item in navItems"
                :key="item.path"
                :class="['nav-link', currentPath === item.path && 'nav-link-active']"
                @click="currentPath = item.path"
              >
                {{ item.name }}
              </button>
            </div>
          </div>
          <div class="text-sm text-gray-500">
            v4.0.0
          </div>
        </div>
      </div>
    </nav>

    <!-- 主内容 -->
    <main class="max-w-4xl mx-auto px-4 py-8">
      <div v-if="store.loading" class="text-center py-12">
        <div class="text-gray-500">加载中...</div>
      </div>
      <template v-else>
        <GeneralSettings v-if="currentPath === '/'" @save="handleSave" />
        <CustomFields v-else-if="currentPath === '/custom-fields'" @save="handleSave" />
        <KeyboardShortcuts v-else-if="currentPath === '/shortcuts'" />
        <ChangeLog v-else-if="currentPath === '/changelog'" />
      </template>
    </main>

    <!-- 底部 -->
    <footer class="border-t border-gray-200 mt-12">
      <div class="max-w-4xl mx-auto px-4 py-6">
        <div class="flex justify-between items-center text-sm text-gray-500">
          <div>
            中文填表助手 - 一键填充网页表单
          </div>
          <div class="flex space-x-4">
            <button class="hover:text-gray-700" @click="handleReset">恢复默认设置</button>
          </div>
        </div>
      </div>
    </footer>

    <!-- 保存提示 -->
    <transition name="fade">
      <div
        v-if="showSaved"
        class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        保存成功
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useOptionsStore } from './store'
import GeneralSettings from './pages/GeneralSettings.vue'
import CustomFields from './pages/CustomFields.vue'
import KeyboardShortcuts from './pages/KeyboardShortcuts.vue'
import ChangeLog from './pages/ChangeLog.vue'

const store = useOptionsStore()
const currentPath = ref('/')
const showSaved = ref(false)

const navItems = [
  { name: '通用设置', path: '/' },
  { name: '自定义字段', path: '/custom-fields' },
  { name: '快捷键', path: '/shortcuts' },
  { name: '更新日志', path: '/changelog' },
]

onMounted(async () => {
  await store.load()
})

async function handleSave() {
  await store.save()
  showSaved.value = true
  setTimeout(() => {
    showSaved.value = false
  }, 2000)
}

async function handleReset() {
  if (confirm('确定要恢复所有默认设置吗？')) {
    await store.reset()
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
