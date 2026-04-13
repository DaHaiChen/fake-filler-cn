<template>
  <div class="playground-card">
    <h1 class="playground-title">组件库测试入口</h1>
    <p class="playground-desc">
      用于本地验证扩展对 Element Plus、Ant Design Vue 表单控件的填充。请加载未打包扩展后在此页试用「一键填充」等功能。
    </p>
    <nav class="playground-nav">
      <el-button type="primary" size="large" @click="goElementPlus">
        Element Plus 表单
      </el-button>
      <a-button type="primary" size="large" @click="goAntd">
        Ant Design Vue 表单
      </a-button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * 跳转至 Element Plus 示例表单。
 */
function goElementPlus(): void {
    router.push('/element-plus')
}

/**
 * 跳转至 Ant Design Vue 示例表单。
 */
function goAntd(): void {
    router.push('/antd')
}
</script>
