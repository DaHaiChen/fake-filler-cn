import { defineConfig } from 'vite'
import { resolve } from 'path'

/**
 * 内容脚本单独打包为单文件 IIFE（无顶层 import）。
 * Chrome 以非 module 方式注入 content script，不能与 options/playground 共用拆出来的 chunk。
 */
export default defineConfig({
    publicDir: false,
    build: {
        emptyOutDir: false,
        outDir: 'dist',
        rollupOptions: {
            input: resolve(__dirname, 'src/content-script/index.ts'),
            output: {
                format: 'iife',
                name: 'FakeFillerContent',
                entryFileNames: 'content-script.js',
                inlineDynamicImports: true,
            },
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
})
