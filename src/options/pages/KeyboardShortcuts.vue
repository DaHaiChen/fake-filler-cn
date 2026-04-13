<template>
  <div>
    <h2 class="page-title">快捷键设置</h2>

    <div class="card">
      <h3 class="card-title">浏览器扩展快捷键</h3>
      <p class="text-sm text-gray-500 mb-4">
        在 Chrome 地址栏输入 <code class="bg-gray-100 px-2 py-1 rounded">chrome://extensions/shortcuts</code> 可自定义快捷键
      </p>

      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div class="font-medium">填充所有输入框</div>
            <div class="text-sm text-gray-500">在当前页面填充所有表单字段</div>
          </div>
          <div class="px-3 py-1 bg-gray-200 rounded text-sm font-mono">
            Ctrl + Shift + F
          </div>
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div class="font-medium">填充当前表单</div>
            <div class="text-sm text-gray-500">填充光标所在表单内的所有字段</div>
          </div>
          <div class="px-3 py-1 bg-gray-200 rounded text-sm font-mono">
            Ctrl + Shift + G
          </div>
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div class="font-medium">填充当前输入框</div>
            <div class="text-sm text-gray-500">只填充当前选中的单个字段</div>
          </div>
          <div class="px-3 py-1 bg-gray-200 rounded text-sm font-mono">
            Ctrl + Shift + H
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <h3 class="card-title">右键菜单</h3>
      <p class="text-sm text-gray-500">
        在网页任意位置右键点击，可看到"填充所有输入框"、"填充当前表单"、"填充当前输入框"三个选项。
        <br />可在通用设置中禁用右键菜单。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
