<template>
  <div>
    <h2 class="page-title">更新日志</h2>

    <div class="space-y-6">
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-primary-600">v4.0.0</h3>
          <span class="text-sm text-gray-500">2024年</span>
        </div>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>全新中文版本来袭！</li>
          <li>所有填充数据改为中文，更适合中国用户</li>
          <li>升级技术栈：Vue 3 + Vite + Tailwind CSS</li>
          <li>优化代码结构，性能提升</li>
          <li>新增中文姓名、地址、电话号码生成</li>
          <li>支持国内常用邮箱域名（QQ、163、126等）</li>
          <li>简化设置页面，更易用</li>
          <li>移除云同步功能，纯本地存储</li>
        </ul>
      </div>

      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-700">v3.4.0</h3>
          <span class="text-sm text-gray-500">原版 Fake Filler</span>
        </div>
        <p class="text-sm text-gray-500">
          原始英文版本，由 Hussein Shabbir 开发维护。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
