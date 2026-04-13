import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync, readdirSync } from 'fs'

// 复制静态文件的插件
function copyStaticFiles() {
  return {
    name: 'copy-static-files',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist')
      const distImagesDir = resolve(distDir, 'images')
      const distZhCnDir = resolve(distDir, '_locales/zh_CN')

      if (!existsSync(distImagesDir)) {
        mkdirSync(distImagesDir, { recursive: true })
      }
      if (!existsSync(distZhCnDir)) {
        mkdirSync(distZhCnDir, { recursive: true })
      }

      copyFileSync(
        resolve(__dirname, 'public/manifest.json'),
        resolve(distDir, 'manifest.json')
      )

      const iconsDir = resolve(__dirname, 'public/images')
      const icons = ['16.png', '32.png', '48.png', '64.png', '96.png', '128.png']
      icons.forEach(icon => {
        try {
          copyFileSync(
            resolve(iconsDir, `icon-${icon}`),
            resolve(distImagesDir, `icon-${icon}`)
          )
        } catch {}
      })

      copyFileSync(
        resolve(__dirname, '_locales/zh_CN/messages.json'),
        resolve(distZhCnDir, 'messages.json')
      )

      // 内联 storage chunk 到 content-script 和 background
      const assetsDir = resolve(distDir, 'assets')
      if (!existsSync(assetsDir)) return

      const storageFile = readdirSync(assetsDir).find(f => f.includes('storage') && f.endsWith('.js'))
      if (!storageFile) return

      const storageChunk = readFileSync(resolve(assetsDir, storageFile), 'utf-8')

      // 找出 storage chunk 中 getOptions 的实际压缩函数名（用于与入口中的 import 绑定对接）
      const getOptsMatch = storageChunk.match(/async function (\w+)\([^)]*\)\s*\{[^}]*chrome\.storage\.local\.get/)

      /**
       * 从 `import { foo }` / `import { foo as bar }` 中解析第一个本地绑定名。
       * 禁止对绑定名做全文件 `replace`：打包后可能是单字母（如 `t`），会误替换所有字母 `t` 导致脚本语法崩溃。
       */
      function extractFirstImportBinding(importStatement: string): string | null {
        const inner = importStatement.match(/\{\s*([^}]+)\s*\}/)?.[1]
        if (!inner) return null
        const firstSpec = inner.split(',')[0].trim()
        if (firstSpec.includes(' as ')) {
          const parts = firstSpec.split(/\s+as\s+/)
          return parts[parts.length - 1]?.trim() ?? null
        }
        return firstSpec || null
      }

      const storageImportRe = /import\s*\{[^}]+\}\s*from\s*["']\.?\/?assets\/storage[^"']*["']\s*;?/g

      function scriptImportsStorageChunk(script: string): boolean {
        return /import\s*\{[^}]+\}\s*from\s*["']\.?\/?assets\/storage[^"']*["']/.test(script)
      }

      // 移除 export 和 Vite 模块化代码，只保留函数定义
      let storageCode = storageChunk
        .replace(/export\{[^}]+\};?/g, '')
        .replace(/var \w+=Object\.defineProperty[\s\S]+?;\s*\}\)/, '')
        .replace(/^var \w+=\{[\s\S]*?\};/m, '')

      function linkStorageBinding(script: string): string {
        const importMatch = script.match(storageImportRe)
        const importLine = importMatch?.[0] ?? ''
        const binding = importLine ? extractFirstImportBinding(importLine) : null
        let out = script.replace(storageImportRe, '')
        const actualName = getOptsMatch?.[1]
        const link =
          binding && actualName && binding !== actualName
            ? `const ${binding}=${actualName};`
            : ''
        return storageCode + link + out
      }

      // 处理 content-script.js（可能由独立 IIFE 构建生成，此处不存在则跳过）
      const contentScriptPath = resolve(distDir, 'content-script.js')
      if (existsSync(contentScriptPath)) {
        let contentScript = readFileSync(contentScriptPath, 'utf-8')
        if (scriptImportsStorageChunk(contentScript)) {
          contentScript = linkStorageBinding(contentScript)
          writeFileSync(contentScriptPath, contentScript)
        }
      }

      // 处理 background.js
      const backgroundPath = resolve(distDir, 'background.js')
      if (existsSync(backgroundPath)) {
        let backgroundScript = readFileSync(backgroundPath, 'utf-8')
        backgroundScript = backgroundScript.replace(/__vite_ssr_import_\d+/g, '')
        if (scriptImportsStorageChunk(backgroundScript)) {
          backgroundScript = linkStorageBinding(backgroundScript)
          writeFileSync(backgroundPath, backgroundScript)
        }
      }

      // 保留 storage chunk：options 页为 ES module，仍 `import` 该文件，不可删除
    }
  }
}

/**
 * 仅在 `vite --mode playground` 时启用：开发服务器把 `/` 指向 `playground.html`，
 * 这样 `pnpm dev:playground` 使用 `--open /` 即可打开测试页，避免根路径无页面。
 */
function playgroundRootRedirect(): Plugin {
    return {
        name: 'playground-root-redirect',
        apply: 'serve',
        configureServer(server) {
            server.middlewares.use((req, _res, next) => {
                const reqWithUrl = req as { url?: string }
                const raw = reqWithUrl.url ?? ''
                if (raw === '/' || raw.startsWith('/?')) {
                    const search = raw.includes('?') ? raw.slice(raw.indexOf('?')) : ''
                    reqWithUrl.url = `/playground.html${search}`
                }
                next()
            })
        },
    }
}

export default defineConfig(({ mode }) => ({
    plugins: [vue(), copyStaticFiles(), ...(mode === 'playground' ? [playgroundRootRedirect()] : [])],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                options: resolve(__dirname, 'index.html'),
                playground: resolve(__dirname, 'playground.html'),
                background: resolve(__dirname, 'src/background/index.ts'),
            },
            output: {
                entryFileNames: '[name].js',
            },
        },
    },
}))
