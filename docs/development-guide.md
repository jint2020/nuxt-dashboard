# 开发指南

> 面向 Vue 3 开发者的项目指导文档。本项目是一个 **Vite + Vue 3** 的 Dashboard 框架骨架，使用 [Nuxt UI v4](https://ui.nuxt.com) 作为组件库。

---

## 目录

1. [技术栈总览](#1-技术栈总览)
2. [项目结构](#2-项目结构)
3. [快速开始](#3-快速开始)
4. [核心概念：与标准 Vue 3 项目的差异](#4-核心概念与标准-vue-3-项目的差异)
5. [路由系统](#5-路由系统)
6. [布局系统](#6-布局系统)
7. [Nuxt UI 组件库](#7-nuxt-ui-组件库)
8. [样式系统](#8-样式系统)
9. [状态管理](#9-状态管理)
10. [键盘快捷键](#10-键盘快捷键)
11. [暗色模式](#11-暗色模式)
12. [TypeScript 类型体系](#12-typescript-类型体系)
13. [常见开发任务](#13-常见开发任务)
14. [构建与部署](#14-构建与部署)
15. [项目约定与规范](#15-项目约定与规范)
16. [常见问题（FAQ）](#16-常见问题faq)

---

## 1. 技术栈总览

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.5 | 核心框架（Composition API + `<script setup>`） |
| Vite | ^7.3 | 构建工具 |
| TypeScript | ^6.0 | 类型系统（strict 模式） |
| Nuxt UI | ^4.7 | 组件库（Dashboard 组件 + 通用 UI） |
| Tailwind CSS | ^4.2 | 原子化 CSS |
| Vue Router | ^5.0 | 路由（文件系统路由） |
| VueUse | ^14.3 | 组合式工具函数集 |
| pnpm | 10.33 | 包管理器 |

项目零外部网络依赖，可完全离线/内网运行。

---

## 2. 项目结构

```
nuxt-app/
├── index.html                      # SPA 入口 HTML
├── vite.config.ts                  # Vite 配置（插件、主题色）
├── tsconfig.json                   # TypeScript 配置入口
├── tsconfig.app.json               # 应用 TS 配置（strict 模式）
├── tsconfig.node.json              # 构建工具 TS 配置
├── eslint.config.ts                # ESLint 扁平化配置
├── package.json                    # 依赖与脚本
├── vercel.json                     # 部署配置（SPA 回退）
│
├── public/
│   └── logo.svg                    # 静态资源（不经 Vite 处理）
│
└── src/
    ├── main.ts                     # 应用入口（创建 app、注册插件）
    ├── App.vue                     # 根组件（UApp + RouterView）
    ├── route-map.d.ts              # 自动生成的路由类型（勿手动编辑）
    ├── vite-env.d.ts               # Vite 环境类型声明
    │
    ├── assets/css/
    │   └── main.css                # Tailwind + Nuxt UI 入口 + 自定义主题色
    │
    ├── layouts/
    │   └── default.vue             # Dashboard 布局（侧边栏 + 搜索 + 通知）
    │
    ├── pages/
    │   └── index.vue               # /  首页（空白面板，待添加业务内容）
    │
    ├── components/
    │   ├── TeamsMenu.vue           # 侧边栏顶部团队选择器
    │   ├── UserMenu.vue            # 侧边栏底部用户菜单（含主题/外观切换）
    │   └── NotificationsSlideover.vue  # 通知侧滑面板（空状态）
    │
    ├── composables/
    │   └── useDashboard.ts         # 共享状态：通知面板开关 + 全局快捷键
    │
    └── types/
        └── index.d.ts              # 领域类型定义（当前为空，待添加）
```

---

## 3. 快速开始

### 环境要求

- **Node.js** >= 22
- **pnpm** >= 10.33（项目通过 `packageManager` 字段锁定版本）

### 安装与运行

```bash
pnpm install              # 安装依赖
pnpm dev                  # 开发服务器（http://localhost:5173）
pnpm build                # 生产构建
pnpm preview              # 预览生产构建
pnpm lint                 # ESLint 代码检查
pnpm typecheck            # TypeScript 类型检查
```

---

## 4. 核心概念：与标准 Vue 3 项目的差异

### 4.1 自动导入（Auto-imports）

Nuxt UI 的 Vite 插件会在构建时自动注册：
- 所有 `U*` 组件（UButton, UInput, UTable, UModal 等）
- 内置 composable：`useToast`, `defineShortcuts`, `useAppConfig` 等
- `src/components/` 目录下的自定义组件也会自动导入

```vue
<!-- 不需要 import UButton、TeamsMenu 等 -->
<template>
  <UButton label="点击" />
  <TeamsMenu />
</template>

<script setup lang="ts">
// 不需要 import useToast
const toast = useToast()
</script>
```

**注意**：Nuxt UI 的类型（如 `TableColumn`, `NavigationMenuItem`）仍需手动 `import type`。

### 4.2 文件系统路由

路由由 `vue-router/vite` 插件根据 `src/pages/` 目录结构自动生成，无需手动维护路由配置表。

### 4.3 布局系统

`vite-plugin-vue-layouts` 自动将 `src/layouts/default.vue` 包裹在所有页面外层。

### 4.4 应用入口

```typescript
// src/main.ts
import './assets/css/main.css'
import { createApp } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'  // 自动生成的路由
import { setupLayouts } from 'virtual:generated-layouts'           // 布局系统
import { createHead } from '@unhead/vue/client'                    // HTML head 管理
import ui from '@nuxt/ui/vue-plugin'                               // Nuxt UI 插件
import App from './App.vue'

const app = createApp(App)
const head = createHead()
const router = createRouter({
  routes: setupLayouts(routes as RouteRecordRaw[]),
  history: createWebHistory()
})

app.use(head)
app.use(router)
app.use(ui)
app.mount('#app')

if (import.meta.hot) {
  handleHotUpdate(router)  // 路由 HMR
}
```

---

## 5. 路由系统

### 5.1 文件到路由的映射

`src/pages/` 目录下的 `.vue` 文件自动映射为路由。当前只有一个页面：

| 文件路径 | 路由路径 |
|---------|---------|
| `pages/index.vue` | `/` |

### 5.2 添加新路由

在 `pages/` 目录下创建 `.vue` 文件即可：

```bash
src/pages/orders.vue         →  /orders
src/pages/orders/index.vue   →  /orders
src/pages/orders/detail.vue  →  /orders/detail
```

### 5.3 嵌套路由

当 `pages/` 下同时存在 `xxx.vue` 和 `xxx/` 目录时，`xxx.vue` 作为父路由组件，需要包含 `<RouterView />`：

```vue
<!-- src/pages/settings.vue -->
<template>
  <UDashboardPanel id="settings">
    <template #body>
      <RouterView />
    </template>
  </UDashboardPanel>
</template>
```

### 5.4 类型安全路由

路由类型自动生成在 `src/route-map.d.ts`（**勿手动编辑**），`useRoute()` 和 `router.push()` 中可获得类型提示。

---

## 6. 布局系统

`src/layouts/default.vue` 实现了 Dashboard Shell：

```
┌──────────────────────────────────────────┐
│ UDashboardGroup                          │
│ ┌──────────┐ ┌──────────────────────────┐│
│ │ Sidebar   │ │                          ││
│ │           │ │                          ││
│ │ TeamsMenu │ │     <RouterView />       ││
│ │ SearchBtn │ │      (页面内容)           ││
│ │ NavMenu   │ │                          ││
│ │ UserMenu  │ │                          ││
│ └──────────┘ └──────────────────────────┘│
│ + UDashboardSearch (全局命令面板)          │
│ + NotificationsSlideover (通知面板)        │
└──────────────────────────────────────────┘
```

| 组件 | 位置 | 功能 |
|------|------|------|
| `TeamsMenu` | 侧边栏顶部 | 团队切换下拉菜单 |
| `UDashboardSearchButton` | 侧边栏 | 触发全局搜索 |
| `UNavigationMenu` | 侧边栏 | 主导航菜单 |
| `UserMenu` | 侧边栏底部 | 用户头像、主题切换、外观切换、退出 |
| `UDashboardSearch` | 全局 | 命令面板（Ctrl/Cmd+K） |
| `NotificationsSlideover` | 全局 | 通知侧滑面板 |

---

## 7. Nuxt UI 组件库

### 7.1 与 Nuxt 框架的关系

**Nuxt UI v4 可以脱离 Nuxt 框架独立使用**。本项目通过 `@nuxt/ui/vite` 插件和 `@nuxt/ui/vue-plugin` 集成。

### 7.2 常用组件速查

#### Dashboard 组件

| 组件 | 用途 |
|------|------|
| `UApp` | 应用根容器 |
| `UDashboardGroup` | Dashboard 容器（sidebar + content） |
| `UDashboardSidebar` | 可折叠/可调整宽度的侧边栏 |
| `UDashboardPanel` | 页面面板（含 header/body 插槽） |
| `UDashboardNavbar` | 面板顶部导航栏 |
| `UDashboardToolbar` | 导航栏下方的工具栏 |
| `UDashboardSidebarCollapse` | 侧边栏折叠/展开按钮 |
| `UDashboardSearch` | 全局命令面板 |
| `UDashboardSearchButton` | 触发搜索的按钮 |

#### 通用 UI 组件

| 组件 | 用途 |
|------|------|
| `UButton` | 按钮 |
| `UInput` | 输入框 |
| `UTextarea` | 多行文本 |
| `USelect` | 下拉选择 |
| `UCheckbox` | 复选框 |
| `USwitch` | 开关 |
| `UBadge` | 徽章 |
| `UAvatar` | 头像 |
| `UIcon` | 图标 |
| `UTooltip` | 悬停提示 |
| `UTable` | 数据表格 |
| `UForm` / `UFormField` | 表单 + 验证 |
| `UModal` | 模态弹窗 |
| `USlideover` | 侧滑面板 |
| `UDropdownMenu` | 下拉菜单 |
| `UNavigationMenu` | 导航菜单 |
| `UCard` | 卡片 |

### 7.3 在渲染函数中使用

在 `h()` 渲染函数中使用 Nuxt UI 组件时，需要先通过 `resolveComponent()` 解析：

```vue
<script setup lang="ts">
import { h, resolveComponent } from 'vue'

const UBadge = resolveComponent('UBadge')
// 然后在 h() 中使用
h(UBadge, { color: 'success' }, () => '在线')
</script>
```

### 7.4 图标系统

使用 [Iconify](https://icones.js.org/) 图标，构建时打包（无需联网）：

```vue
<UIcon name="i-lucide-house" />
<UButton icon="i-lucide-plus" />
```

### 7.5 `ui` prop 自定义样式

Nuxt UI 组件支持 `ui` prop 覆盖内部样式：

```vue
<UDashboardPanel :ui="{ body: 'lg:py-12' }" />
<UTable :ui="{ th: 'py-2', td: 'border-b border-default' }" />
```

---

## 8. 样式系统

### 8.1 Tailwind CSS v4

```css
/* src/assets/css/main.css */
@import "tailwindcss" theme(static);
@import "@nuxt/ui";

@theme static {
  --font-sans: system-ui, -apple-system, sans-serif;

  /* 自定义绿色调色板（oklch 色彩空间） */
  --color-green-50: oklch(90.98% 0.04338 166.72);
  --color-green-500: oklch(70.253% 0.13197 160.37);
  --color-green-900: oklch(17.276% 0.02184 161.78);
}

.dark {
  --ui-primary: var(--ui-color-primary-500);
}
```

### 8.2 主题色配置

在 `vite.config.ts` 中设置默认主题色：

```typescript
ui({
  ui: {
    colors: {
      primary: 'green',   // 主色调
      neutral: 'zinc'     // 中性色
    }
  }
})
```

运行时可通过 `UserMenu.vue` 中的主题选择器切换（17 种主色 + 5 种中性色）。

### 8.3 Nuxt UI 语义化工具类

```html
<p class="text-highlighted">高亮文本</p>
<p class="text-muted">次要文本</p>
<p class="text-dimmed">暗淡文本</p>
<div class="bg-elevated/25">提升背景</div>
<div class="border-default">默认边框</div>
```

---

## 9. 状态管理

项目采用极简策略 -- **不使用 Pinia 或 Vuex**。唯一的全局共享状态通过 composable 管理：

```typescript
// src/composables/useDashboard.ts
const _useDashboard = () => {
  const isNotificationsSlideoverOpen = ref(false)

  defineShortcuts({
    'g-h': () => router.push('/'),
    'n': () => isNotificationsSlideoverOpen.value = !isNotificationsSlideoverOpen.value
  })

  watch(() => route.fullPath, () => {
    isNotificationsSlideoverOpen.value = false
  })

  return { isNotificationsSlideoverOpen }
}

export const useDashboard = createSharedComposable(_useDashboard)
```

`createSharedComposable` 确保多组件共享同一份状态（单例模式）。

---

## 10. 键盘快捷键

通过 Nuxt UI 的 `defineShortcuts()` 注册：

| 快捷键 | 功能 |
|--------|------|
| `g` 然后 `h` | 跳转首页 |
| `n` | 切换通知面板 |
| `Ctrl/Cmd + K` | 打开命令面板 |

添加新快捷键：

```typescript
// 在 useDashboard.ts 或组件内
defineShortcuts({
  'g-o': () => router.push('/orders'),  // 新增
})
```

---

## 11. 暗色模式

通过 VueUse 的 `useColorMode()` 实现：

```typescript
import { useColorMode } from '@vueuse/core'
const colorMode = useColorMode()
colorMode.value = 'dark'   // 'light' | 'dark' | 'auto'
```

`UserMenu.vue` 已内置明暗切换 UI。`index.html` 包含防闪烁内联脚本。

---

## 12. TypeScript 类型体系

### Nuxt UI 类型导入

```typescript
import type { TableColumn } from '@nuxt/ui'
import type { NavigationMenuItem } from '@nuxt/ui'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { FormSubmitEvent } from '@nuxt/ui'
```

### satisfies 操作符

项目使用 `satisfies` 进行类型检查而保留字面量推导：

```typescript
const links = [[{
  label: '首页',
  icon: 'i-lucide-house',
  to: '/'
}]] satisfies NavigationMenuItem[][]
```

---

## 13. 常见开发任务

### 13.1 添加新页面

```vue
<!-- src/pages/orders.vue -->
<template>
  <UDashboardPanel id="orders">
    <template #header>
      <UDashboardNavbar title="工单">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- 页面内容 -->
    </template>
  </UDashboardPanel>
</template>
```

然后在 `src/layouts/default.vue` 中添加导航链接：

```typescript
const links = [[{
  label: '首页',
  icon: 'i-lucide-house',
  to: '/'
}, {
  label: '工单',
  icon: 'i-lucide-clipboard-list',
  to: '/orders'
}]] satisfies NavigationMenuItem[][]
```

### 13.2 添加侧边栏子菜单

```typescript
{
  label: '设置',
  icon: 'i-lucide-settings',
  to: '/settings',
  type: 'trigger',
  defaultOpen: true,
  children: [
    { label: '通用', to: '/settings', exact: true },
    { label: '成员', to: '/settings/members' }
  ]
}
```

### 13.3 添加模态弹窗

```vue
<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <UModal v-model:open="open" title="确认操作">
    <UButton label="打开" />
    <template #body>
      <p>确定要执行此操作吗？</p>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton label="取消" color="neutral" variant="subtle" @click="open = false" />
        <UButton label="确认" @click="handleConfirm" />
      </div>
    </template>
  </UModal>
</template>
```

### 13.4 使用 Toast 通知

```typescript
const toast = useToast()

toast.add({
  title: '操作成功',
  description: '数据已保存',
  icon: 'i-lucide-check',
  color: 'success'
})
```

### 13.5 数据获取

推荐使用 VueUse 的 `useFetch`：

```typescript
import { useFetch } from '@vueuse/core'

const baseUrl = import.meta.env.VITE_API_BASE_URL
const { data, isFetching } = useFetch(`${baseUrl}/orders`).json<Order[]>()
```

### 13.6 表单验证（Zod）

项目已包含 `zod` 依赖：

```vue
<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  name: z.string().min(2, '名称至少 2 个字符'),
  email: z.string().email('邮箱格式不正确')
})
type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({ name: '', email: '' })

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <UFormField label="名称" name="name">
      <UInput v-model="state.name" />
    </UFormField>
    <UFormField label="邮箱" name="email">
      <UInput v-model="state.email" />
    </UFormField>
    <UButton type="submit" label="提交" />
  </UForm>
</template>
```

---

## 14. 构建与部署

### 构建

```bash
pnpm build    # 输出到 dist/
```

### 部署

纯静态 SPA，需配置 SPA 回退规则。

**Nginx：**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### CI/CD

GitHub Actions 配置在 `.github/workflows/ci.yml`，每次 push 触发 lint → build → typecheck。

---

## 15. 项目约定与规范

| 项目 | 约定 |
|------|------|
| 缩进 | 2 空格 |
| 行尾 | LF |
| 字符编码 | UTF-8 |
| 组件命名 | 允许单词组件名 |
| 模板属性 | 单行最多 3 个 |
| UI 语言 | 中文（硬编码） |

### Dashboard 页面标准结构

```vue
<template>
  <UDashboardPanel id="unique-id">
    <template #header>
      <UDashboardNavbar title="页面标题">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- 页面内容 -->
    </template>
  </UDashboardPanel>
</template>
```

---

## 16. 常见问题（FAQ）

### Q: 为什么项目叫 nuxt-app 但不是 Nuxt 项目？

使用 **Nuxt UI** 组件库，但运行在纯 **Vite + Vue 3** 环境中。Nuxt UI v4 支持独立使用。

### Q: 为什么模板中的组件没有 import？

Nuxt UI 的 Vite 插件自动注册了所有 `U*` 组件、内置 composable，以及 `src/components/` 下的自定义组件。

### Q: 在 h() 渲染函数中为什么需要 resolveComponent？

自动导入只作用于 `<template>` 编译阶段，`<script>` 中需要手动解析。

### Q: 如何切换主题色？

运行时：`UserMenu.vue` 已内置主题选择器。构建时默认值：修改 `vite.config.ts` 中 `ui({ ui: { colors: { primary: 'blue' } } })`。

### Q: 项目需要联网吗？

不需要。字体使用系统默认字体，图标构建时打包，无外部 API 调用。完全支持内网部署。
