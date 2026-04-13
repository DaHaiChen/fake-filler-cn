<template>
  <div class="playground-card">
    <router-link class="playground-back" to="/">← 返回首页</router-link>
    <h1 class="playground-title">Element Plus 表单</h1>
    <p class="playground-desc">
      包含 Input、Textarea、Select、DatePicker，便于测试扩展中 <code>element-plus</code> 适配器。
    </p>
    <el-form :model="form" label-width="100px" label-position="right">
      <el-form-item label="姓名" required>
        <el-input
          v-model="form.userName"
          name="userName"
          placeholder="请输入姓名"
          clearable
        />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input
          v-model="form.phone"
          name="phone"
          placeholder="请输入手机号"
          clearable
        />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input
          v-model="form.email"
          name="email"
          type="email"
          placeholder="请输入邮箱"
          clearable
        />
      </el-form-item>
      <el-form-item label="城市">
        <el-select
          v-model="form.city"
          name="city"
          placeholder="请选择城市"
          style="width: 100%"
        >
          <el-option label="北京" value="beijing" />
          <el-option label="上海" value="shanghai" />
          <el-option label="广州" value="guangzhou" />
          <el-option label="深圳" value="shenzhen" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          name="remark"
          type="textarea"
          :rows="3"
          placeholder="备注信息"
        />
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="form.date"
          name="date"
          type="date"
          placeholder="选择日期"
          style="width: 100%"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface ElementPlusDemoForm {
    userName: string
    phone: string
    email: string
    city: string
    remark: string
    date: string
}

const form = reactive<ElementPlusDemoForm>({
    userName: '',
    phone: '',
    email: '',
    city: '',
    remark: '',
    date: '',
})
</script>
