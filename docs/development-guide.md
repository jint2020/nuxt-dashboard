# Vue Dashboard 开发指南

> 面向 Vue 3 开发者的项目完整指导文档。本项目虽然包名为 `nuxt-app`，但实际是一个 **Vite + Vue 3** 项目，使用 [Nuxt UI v4](https://ui.nuxt.com) 作为组件库。

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
9. [数据获取](#9-数据获取)
10. [状态管理](#10-状态管理)
11. [表单与验证](#11-表单与验证)
12. [表格（TanStack Table）](#12-表格tanstack-table)
13. [图表（Unovis）](#13-图表unovis)
14. [键盘快捷键](#14-键盘快捷键)
15. [暗色模式](#15-暗色模式)
16. [TypeScript 类型体系](#16-typescript-类型体系)
17. [常见开发任务](#17-常见开发任务)
18. [构建与部署](#18-构建与部署)
19. [项目约定与规范](#19-项目约定与规范)
20. [常见问题（FAQ）](#20-常见问题faq)

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
| TanStack Table | ^8.21 | 无头表格逻辑 |
| Unovis | ^1.6 | 数据可视化 |
| Zod | ^4.4 | Schema 验证 |
| date-fns | ^4.1 | 日期工具 |
| pnpm | 10.33 | 包管理器 |

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
├── vercel.json                     # Vercel 部署配置（SPA 回退）
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
    ├── assets/
    │   └── css/
    │       └── main.css            # Tailwind + Nuxt UI 入口 + 自定义主题色
    │
    ├── layouts/
    │   └── default.vue             # 默认布局（侧边栏 + 搜索 + 通知）
    │
    ├── pages/                      # 文件系统路由（文件 = 路由）
    │   ├── index.vue               # /          首页仪表盘
    │   ├── customers.vue           # /customers 客户表格
    │   ├── inbox.vue               # /inbox     邮件收件箱
    │   ├── settings.vue            # /settings  设置布局（嵌套路由父组件）
    │   └── settings/
    │       ├── index.vue           # /settings          个人资料
    │       ├── members.vue         # /settings/members  成员管理
    │       ├── notifications.vue   # /settings/notifications 通知设置
    │       └── security.vue        # /settings/security 安全设置
    │
    ├── components/                 # 可复用组件
    │   ├── TeamsMenu.vue           # 侧边栏顶部团队选择器
    │   ├── UserMenu.vue            # 侧边栏底部用户菜单（含主题切换）
    │   ├── NotificationsSlideover.vue  # 通知侧滑面板
    │   ├── home/                   # 首页子组件
    │   │   ├── HomeStats.vue       #   统计卡片（4 宫格）
    │   │   ├── HomeChart.vue       #   收入折线图
    │   │   ├── HomeDateRangePicker.vue  #   日期范围选择器
    │   │   ├── HomePeriodSelect.vue     #   周期选择（日/周/月）
    │   │   └── HomeSales.vue       #   销售记录表格
    │   ├── customers/              # 客户页子组件
    │   │   ├── CustomersAddModal.vue    #   新增客户弹窗
    │   │   └── CustomersDeleteModal.vue #   删除确认弹窗
    │   ├── inbox/                  # 收件箱子组件
    │   │   ├── InboxList.vue       #   邮件列表
    │   │   └── InboxMail.vue       #   邮件详情
    │   └── settings/               # 设置页子组件
    │       └── SettingsMembersList.vue  #   成员列表
    │
    ├── composables/
    │   └── useDashboard.ts         # 共享状态：通知面板开关 + 全局快捷键
    │
    ├── types/
    │   └── index.d.ts              # 领域类型定义
    │
    └── utils/
        └── index.ts                # 工具函数（randomInt, randomFrom）
```

---

## 3. 快速开始

### 环境要求

- **Node.js** >= 22
- **pnpm** >= 10.33（项目通过 `packageManager` 字段锁定版本）

### 安装与运行

```bash
# 安装依赖
pnpm install

# 启动开发服务器（http://localhost:5173）
pnpm dev

# 生产构建
pnpm build

# 预览生产构建
pnpm preview

# 代码检查
pnpm lint

# 类型检查
pnpm typecheck
```

> **注意**：项目没有配置测试套件。

---

## 4. 核心概念：与标准 Vue 3 项目的差异

作为 Vue 3 开发者，你会发现这个项目在以下几个方面与标准 `create-vue` 脚手架项目不同：

### 4.1 自动导入（Auto-imports）

Nuxt UI 的 Vite 插件会在构建时自动注册所有 `U*` 前缀的组件和 composable。你**不需要**手动 import 它们：

```vue
<!-- 不需要 import UButton、UInput 等 -->
<template>
  <UButton label="点击" />
  <UInput v-model="value" />
</template>

<script setup lang="ts">
// 不需要 import useToast、defineShortcuts 等
const toast = useToast()
</script>
```

**完整的自动导入列表**：
- 所有 `U*` 组件（UButton, UInput, UTable, UModal 等）
- composable：`useToast`, `useColorMode`, `defineShortcuts`, `useAppConfig` 等
- 类型：`TableColumn`, `NavigationMenuItem`, `DropdownMenuItem`, `FormSubmitEvent` 等需要通过 `import type` 手动导入

### 4.2 文件系统路由

路由由 `vue-router/vite` 插件根据 `src/pages/` 目录结构自动生成，无需手动维护路由配置表。详见[第 5 节](#5-路由系统)。

### 4.3 布局系统

`vite-plugin-vue-layouts` 自动将 `src/layouts/default.vue` 包裹在所有页面外层。详见[第 6 节](#6-布局系统)。

### 4.4 应用入口差异

对比标准 Vue 3 项目，`main.ts` 有以下额外配置：

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
  routes: setupLayouts(routes as RouteRecordRaw[]),  // 路由 + 布局合并
  history: createWebHistory()
})

app.use(head)
app.use(router)
app.use(ui)    // 注册 Nuxt UI（自动导入组件/composable）
app.mount('#app')

if (import.meta.hot) {
  handleHotUpdate(router)  // 路由 HMR
}
```

---

## 5. 路由系统

### 5.1 文件到路由的映射

`src/pages/` 目录下的 `.vue` 文件自动映射为路由：

| 文件路径 | 路由路径 | 说明 |
|---------|---------|------|
| `pages/index.vue` | `/` | 首页 |
| `pages/customers.vue` | `/customers` | 客户管理 |
| `pages/inbox.vue` | `/inbox` | 收件箱 |
| `pages/settings.vue` | `/settings` | 设置页（父路由，含嵌套 `<RouterView />`） |
| `pages/settings/index.vue` | `/settings` | 设置 - 个人资料 |
| `pages/settings/members.vue` | `/settings/members` | 设置 - 成员 |
| `pages/settings/notifications.vue` | `/settings/notifications` | 设置 - 通知 |
| `pages/settings/security.vue` | `/settings/security` | 设置 - 安全 |

### 5.2 添加新路由

只需在 `pages/` 目录下创建 `.vue` 文件即可：

```bash
# 创建文件即创建路由
src/pages/reports.vue        →  /reports
src/pages/reports/index.vue  →  /reports
src/pages/reports/daily.vue  →  /reports/daily
```

### 5.3 嵌套路由

当 `pages/` 下同时存在 `xxx.vue` 文件和 `xxx/` 目录时，`xxx.vue` 成为布局（父组件），需要包含 `<RouterView />` 来渲染子路由：

```vue
<!-- src/pages/settings.vue —— 作为 /settings/* 的父组件 -->
<template>
  <UDashboardPanel id="settings">
    <template #body>
      <RouterView />  <!-- 子路由在此渲染 -->
    </template>
  </UDashboardPanel>
</template>
```

### 5.4 类型安全路由

路由类型自动生成在 `src/route-map.d.ts`（**勿手动编辑**）。你可以在 `useRoute()` 和 `router.push()` 中获得类型提示：

```typescript
import { useRoute } from 'vue-router'
const route = useRoute()  // route.path 有类型提示
```

---

## 6. 布局系统

### 6.1 工作原理

`vite-plugin-vue-layouts` 将 `src/layouts/default.vue` 自动应用到所有页面。页面组件通过 `<RouterView />` 渲染在布局内部。

### 6.2 布局结构

当前唯一的布局文件 `src/layouts/default.vue` 实现了完整的 Dashboard Shell：

```
┌──────────────────────────────────────────┐
│ UDashboardGroup                          │
│ ┌──────────┐ ┌──────────────────────────┐│
│ │ Sidebar   │ │                          ││
│ │           │ │                          ││
│ │ TeamsMenu │ │                          ││
│ │           │ │     <RouterView />       ││
│ │ SearchBtn │ │      (页面内容)           ││
│ │           │ │                          ││
│ │ NavMenu   │ │                          ││
│ │           │ │                          ││
│ │ UserMenu  │ │                          ││
│ └──────────┘ └──────────────────────────┘│
│ + UDashboardSearch (全局命令面板)          │
│ + NotificationsSlideover (通知面板)        │
└──────────────────────────────────────────┘
```

关键特性：
- **侧边栏**：可折叠（移动端）、可拖拽调整宽度（桌面端），状态存入 localStorage
- **命令面板**：`Ctrl/Cmd + K` 打开全局搜索/导航
- **通知面板**：从右侧滑入，快捷键 `N` 切换
- **Cookie 提示**：首次访问时通过 Toast 弹出

### 6.3 布局内的关键组件

| 组件 | 位置 | 功能 |
|------|------|------|
| `TeamsMenu` | 侧边栏顶部 | 团队切换下拉菜单 |
| `UDashboardSearchButton` | 侧边栏 | 触发全局搜索 |
| `UNavigationMenu` | 侧边栏 | 主导航 + 外部链接 |
| `UserMenu` | 侧边栏底部 | 用户头像、主题切换、退出 |
| `UDashboardSearch` | 全局 | 命令面板（类似 VS Code 的 Cmd+K） |
| `NotificationsSlideover` | 全局 | 通知列表侧滑面板 |

---

## 7. Nuxt UI 组件库

### 7.1 与 Nuxt 框架的关系

**Nuxt UI v4 可以脱离 Nuxt 框架独立使用**。本项目就是纯 Vue 3 + Vite 项目，通过 `@nuxt/ui/vite` 插件和 `@nuxt/ui/vue-plugin` 集成 Nuxt UI。

### 7.2 常用组件速查

#### 布局与 Dashboard 组件

| 组件 | 用途 | 示例 |
|------|------|------|
| `UApp` | 应用根容器（主题/样式上下文） | 包裹在 `App.vue` 中 |
| `UDashboardGroup` | Dashboard 容器（sidebar + content 布局） | `default.vue` 中 |
| `UDashboardSidebar` | 可折叠/可调整宽度的侧边栏 | `default.vue` 中 |
| `UDashboardPanel` | 页面面板（含 header/body 插槽） | 每个 page 中 |
| `UDashboardNavbar` | 面板顶部导航栏 | 每个 page 中 |
| `UDashboardToolbar` | 导航栏下方的工具栏 | `index.vue`, `settings.vue` |
| `UDashboardSidebarCollapse` | 侧边栏折叠/展开按钮 | 导航栏的 `#leading` 插槽 |
| `UDashboardSearch` | 全局命令面板（Cmd+K） | `default.vue` 中 |
| `UDashboardSearchButton` | 触发搜索的按钮 | 侧边栏中 |

#### 通用 UI 组件

| 组件 | 用途 |
|------|------|
| `UButton` | 按钮（支持 icon、loading、to 跳转） |
| `UInput` | 输入框 |
| `UTextarea` | 多行文本输入（支持 autoresize） |
| `USelect` | 下拉选择 |
| `UCheckbox` | 复选框 |
| `USwitch` | 开关 |
| `UBadge` | 徽章/标签 |
| `UAvatar` | 头像 |
| `UIcon` | 图标 |
| `UChip` | 指示器圆点 |
| `UKbd` | 键盘按键提示 |
| `UTooltip` | 悬停提示 |
| `USeparator` | 分隔线 |

#### 导航组件

| 组件 | 用途 |
|------|------|
| `UNavigationMenu` | 导航菜单（支持折叠/popover/tooltip） |
| `UTabs` | 标签切换 |
| `UPagination` | 分页 |
| `UDropdownMenu` | 下拉菜单 |

#### 数据展示

| 组件 | 用途 |
|------|------|
| `UTable` | 数据表格（搭配 TanStack Table） |
| `UPageGrid` | 网格布局容器 |
| `UPageCard` | 内容卡片 |
| `UCard` | 通用卡片 |

#### 反馈 & 弹层

| 组件 | 用途 |
|------|------|
| `UModal` | 模态弹窗 |
| `USlideover` | 侧滑面板 |
| `UPopover` | 弹出气泡 |
| `UToast`（通过 `useToast()`） | 轻提示 |

#### 表单

| 组件 | 用途 |
|------|------|
| `UForm` | 表单容器（集成 Zod 验证） |
| `UFormField` | 表单字段（label + description + 验证消息） |
| `UCalendar` | 日历选择器 |

### 7.3 组件使用模式

#### 基础使用（直接写模板）

所有 `U*` 组件都已自动导入，直接在 `<template>` 中使用：

```vue
<template>
  <UButton label="保存" color="primary" icon="i-lucide-save" />
  <UBadge label="Active" color="success" variant="subtle" />
  <UInput v-model="query" placeholder="搜索..." icon="i-lucide-search" />
</template>
```

#### 在渲染函数中使用（表格列等场景）

当需要在 `h()` 渲染函数中使用 Nuxt UI 组件时，**必须**先通过 `resolveComponent()` 解析：

```vue
<script setup lang="ts">
import { h, resolveComponent } from 'vue'

// 必须在 <script setup> 顶层解析
const UAvatar = resolveComponent('UAvatar')
const UBadge = resolveComponent('UBadge')

// 然后在渲染函数中使用
const columns = [{
  accessorKey: 'name',
  header: 'Name',
  cell: ({ row }) => h(UAvatar, { src: row.original.avatar })
}]
</script>
```

### 7.4 图标系统

项目使用 [Iconify](https://icones.js.org/) 图标，通过前缀指定图标集：

```vue
<!-- Lucide 图标（项目主要使用） -->
<UIcon name="i-lucide-house" />
<UButton icon="i-lucide-plus" />

<!-- Simple Icons（品牌图标） -->
<UIcon name="simple-icons:github" />
```

常用 Lucide 图标：`house`, `inbox`, `users`, `settings`, `bell`, `plus`, `trash`, `search`, `send`, `copy`, `check`, `shield`, `book-open`

### 7.5 `ui` prop 自定义样式

几乎所有 Nuxt UI 组件都支持 `ui` prop 来覆盖内部样式：

```vue
<UDashboardPanel :ui="{ body: 'lg:py-12' }" />

<UPageCard
  :ui="{
    container: 'gap-y-1.5',
    wrapper: 'items-start',
    leading: 'p-2.5 rounded-full bg-primary/10',
    title: 'font-normal text-muted text-xs uppercase'
  }"
/>

<UTable
  :ui="{
    base: 'table-fixed border-separate',
    thead: '[&>tr]:bg-elevated/50',
    th: 'py-2 first:rounded-l-lg last:rounded-r-lg',
    td: 'border-b border-default'
  }"
/>
```

---

## 8. 样式系统

### 8.1 Tailwind CSS v4

项目使用 Tailwind CSS v4，语法与 v3 有重大变化：

```css
/* src/assets/css/main.css */
@import "tailwindcss" theme(static);  /* v4 的导入方式 */
@import "@nuxt/ui";                    /* Nuxt UI 预设 */

@theme static {
  --font-sans: 'Public Sans', sans-serif;

  /* 自定义绿色调色板（oklch 色彩空间） */
  --color-green-50: oklch(90.98% 0.04338 166.72);
  --color-green-500: oklch(70.253% 0.13197 160.37);
  --color-green-900: oklch(17.276% 0.02184 161.78);
  /* ... 其他色阶 */
}

.dark {
  --ui-primary: var(--ui-color-primary-500);
}
```

### 8.2 主题色配置

主题色在 `vite.config.ts` 中设置：

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

修改这里的颜色名称即可全局切换主题色。支持的颜色名称：`red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`。

### 8.3 常用 Nuxt UI CSS 变量

在组件样式中可以使用这些 CSS 变量：

```css
var(--ui-primary)          /* 主色 */
var(--ui-bg)               /* 背景色 */
var(--ui-border)           /* 边框色 */
var(--ui-text-highlighted) /* 高亮文本色 */
var(--ui-text-dimmed)      /* 暗淡文本色 */
var(--ui-text-muted)       /* 次要文本色 */
```

### 8.4 常用 Tailwind 工具类（Nuxt UI 语义类）

Nuxt UI 扩展了一些语义化的 Tailwind 类：

```html
<p class="text-highlighted">高亮文本</p>
<p class="text-muted">次要文本</p>
<p class="text-dimmed">暗淡文本</p>
<div class="bg-elevated/25">轻微提升的背景</div>
<div class="border-default">默认边框</div>
<div class="ring-default">默认 ring</div>
```

---

## 9. 数据获取

### 9.1 使用 VueUse 的 useFetch

项目没有后端，所有数据来自外部 API `https://dashboard-template.nuxt.dev/api/`：

```typescript
import { useFetch } from '@vueuse/core'
import type { User } from '../types'

// 基本用法
const { data, isFetching } = useFetch(
  'https://dashboard-template.nuxt.dev/api/customers',
  { initialData: [] }
).json<User[]>()
```

### 9.2 API 端点

| 端点 | 返回类型 | 用途 |
|------|---------|------|
| `/api/customers` | `User[]` | 客户列表 |
| `/api/mails` | `Mail[]` | 邮件列表 |
| `/api/members` | `Member[]` | 成员列表 |
| `/api/notifications` | `Notification[]` | 通知列表 |

### 9.3 useFetch 关键特性

```typescript
const { data, isFetching, error, execute } = useFetch(url, { initialData: [] }).json<T>()
```

| 返回值 | 类型 | 说明 |
|--------|------|------|
| `data` | `Ref<T>` | 响应数据 |
| `isFetching` | `Ref<boolean>` | 加载状态 |
| `error` | `Ref<any>` | 错误信息 |
| `execute` | `() => Promise` | 手动重新请求 |

### 9.4 将来对接真实 API

当你需要对接真实后端时，建议：

1. 将 API 基础 URL 提取为环境变量：
```typescript
// .env
VITE_API_BASE_URL=https://your-api.com

// 使用
const baseUrl = import.meta.env.VITE_API_BASE_URL
const { data } = useFetch(`${baseUrl}/customers`).json<User[]>()
```

2. 或封装一个请求工具函数统一管理 base URL 和错误处理。

---

## 10. 状态管理

### 10.1 设计理念

项目采用极简状态管理策略 -- **不使用 Pinia 或 Vuex**。绝大多数状态是组件内的局部状态（`ref`/`reactive`），唯一的全局共享状态通过 composable 管理。

### 10.2 共享状态：useDashboard

```typescript
// src/composables/useDashboard.ts
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createSharedComposable } from '@vueuse/core'

const _useDashboard = () => {
  const route = useRoute()
  const router = useRouter()
  const isNotificationsSlideoverOpen = ref(false)

  // 全局键盘快捷键
  defineShortcuts({
    'g-h': () => router.push('/'),
    'g-i': () => router.push('/inbox'),
    'g-c': () => router.push('/customers'),
    'g-s': () => router.push('/settings'),
    'n': () => isNotificationsSlideoverOpen.value = !isNotificationsSlideoverOpen.value
  })

  // 路由变化时关闭通知面板
  watch(() => route.fullPath, () => {
    isNotificationsSlideoverOpen.value = false
  })

  return { isNotificationsSlideoverOpen }
}

// createSharedComposable：确保整个应用只有一个实例（单例模式）
export const useDashboard = createSharedComposable(_useDashboard)
```

**`createSharedComposable` 的作用**：无论在多少个组件中调用 `useDashboard()`，都共享同一份状态。类似 Vue 3 之前的 `provide/inject` 全局注入，但无需在 App 层级显式 provide。

### 10.3 其他状态持久化

```typescript
import { useStorage } from '@vueuse/core'

// 将状态持久化到 localStorage
const cookie = useStorage('cookie-consent', 'pending')
// cookie.value 在页面刷新后仍然保留
```

---

## 11. 表单与验证

### 11.1 Zod Schema 验证

项目使用 Zod 定义表单验证规则，与 Nuxt UI 的 `UForm` 组件无缝集成：

```vue
<script setup lang="ts">
import * as z from 'zod'
import { reactive } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'

// 1. 定义 Schema
const schema = z.object({
  name: z.string().min(2, 'Too short'),
  email: z.string().email('Invalid email')
})

// 2. 从 Schema 推导类型
type Schema = z.output<typeof schema>

// 3. 定义表单状态
const state = reactive<Partial<Schema>>({
  name: '',
  email: ''
})

// 4. 提交处理
const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  // event.data 已经过验证，类型安全
  toast.add({ title: 'Success', description: `Created ${event.data.name}` })
}
</script>

<template>
  <!-- 5. 绑定 schema + state -->
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <UFormField label="Name" name="name">
      <UInput v-model="state.name" />
    </UFormField>

    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>

    <UButton type="submit" label="Create" />
  </UForm>
</template>
```

### 11.2 关键点

- `UFormField` 的 `name` 属性必须与 Schema 的字段名一致，才能正确显示验证错误
- `@submit` 只在验证通过时触发
- `state` 使用 `reactive` 而非 `ref`，因为 `UForm` 需要直接观察对象属性变化
- 使用 `Partial<Schema>` 允许字段初始为空

### 11.3 高级验证：跨字段验证

参见 `settings/security.vue` 的密码更改表单：

```typescript
const schema = z.object({
  currentPassword: z.string().min(8, 'Must be at least 8 characters'),
  newPassword: z.string().min(8, 'Must be at least 8 characters')
}).refine(data => data.currentPassword !== data.newPassword, {
  message: 'New password must be different',
  path: ['newPassword']  // 错误显示在 newPassword 字段
})
```

---

## 12. 表格（TanStack Table）

### 12.1 架构概览

客户表格使用 **TanStack Table Core**（无头表格逻辑）+ **Nuxt UI 的 UTable**（UI 渲染层）：

```
TanStack Table Core（逻辑层）
  ├── 排序
  ├── 筛选（全局/列级）
  ├── 分页
  ├── 行选择
  └── 列可见性
        ↓
Nuxt UI UTable（渲染层）
  ├── 表头/表体渲染
  ├── 加载状态
  └── 样式定制
```

### 12.2 完整示例拆解

```vue
<script setup lang="ts">
import { useTemplateRef, h, ref, computed, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { useFetch } from '@vueuse/core'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { User } from '../types'

// 1. 在渲染函数中使用的组件需要先解析
const UAvatar = resolveComponent('UAvatar')
const UBadge = resolveComponent('UBadge')
const UCheckbox = resolveComponent('UCheckbox')

// 2. 获取 table 实例引用
const table = useTemplateRef('table')

// 3. 定义筛选/选择/分页状态
const columnFilters = ref([{ id: 'email', value: '' }])
const rowSelection = ref({ 1: true })  // 默认选中第 2 行
const pagination = ref({ pageIndex: 0, pageSize: 10 })

// 4. 获取数据
const { data, isFetching } = useFetch('...').json<User[]>()

// 5. 定义列
const columns: TableColumn<User>[] = [
  {
    id: 'select',
    header: ({ table }) => h(UCheckbox, {
      'modelValue': table.getIsAllPageRowsSelected(),
      'onUpdate:modelValue': (v) => table.toggleAllPageRowsSelected(!!v)
    }),
    cell: ({ row }) => h(UCheckbox, {
      'modelValue': row.getIsSelected(),
      'onUpdate:modelValue': (v) => row.toggleSelected(!!v)
    })
  },
  { accessorKey: 'id', header: 'ID' },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
      h(UAvatar, { ...row.original.avatar, size: 'lg' }),
      h('p', { class: 'font-medium' }, row.original.name)
    ])
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: 'equals',  // 精确匹配筛选
    cell: ({ row }) => {
      const colorMap = {
        subscribed: 'success',
        unsubscribed: 'error',
        bounced: 'warning'
      }
      return h(UBadge, {
        color: colorMap[row.original.status],
        variant: 'subtle',
        class: 'capitalize'
      }, () => row.original.status)
    }
  }
]
</script>

<template>
  <UTable
    ref="table"
    v-model:column-filters="columnFilters"
    v-model:row-selection="rowSelection"
    v-model:pagination="pagination"
    :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
    :data="data ?? []"
    :columns="columns"
    :loading="isFetching"
  />
</template>
```

### 12.3 通过 tableApi 操作表格

```typescript
// 获取 table 引用
const table = useTemplateRef('table')

// 访问 TanStack Table API
table.value?.tableApi?.getFilteredSelectedRowModel().rows.length  // 已选行数
table.value?.tableApi?.getColumn('status')?.setFilterValue('subscribed')  // 设置列筛选
table.value?.tableApi?.setPageIndex(2)  // 跳转到第 3 页
table.value?.tableApi?.getAllColumns().filter(col => col.getCanHide())  // 可隐藏的列
```

---

## 13. 图表（Unovis）

### 13.1 基本用法

项目使用 [@unovis/vue](https://unovis.dev/) 进行数据可视化：

```vue
<script setup lang="ts">
import { VisXYContainer, VisLine, VisArea, VisAxis, VisCrosshair, VisTooltip } from '@unovis/vue'

type DataRecord = { date: Date; amount: number }

const data = ref<DataRecord[]>([/* ... */])
const x = (_: DataRecord, i: number) => i         // x 轴：索引
const y = (d: DataRecord) => d.amount              // y 轴：金额
const template = (d: DataRecord) => `${d.amount}`  // tooltip 模板
</script>

<template>
  <VisXYContainer :data="data" :padding="{ top: 40 }" class="h-96">
    <!-- 折线 -->
    <VisLine :x="x" :y="y" color="var(--ui-primary)" />
    <!-- 面积填充 -->
    <VisArea :x="x" :y="y" color="var(--ui-primary)" :opacity="0.1" />
    <!-- X 轴 -->
    <VisAxis type="x" :x="x" :tick-format="xTicks" />
    <!-- 十字准线 + 提示 -->
    <VisCrosshair color="var(--ui-primary)" :template="template" />
    <VisTooltip />
  </VisXYContainer>
</template>
```

### 13.2 样式定制

通过 CSS 变量控制图表主题：

```css
.unovis-xy-container {
  --vis-crosshair-line-stroke-color: var(--ui-primary);
  --vis-crosshair-circle-stroke-color: var(--ui-bg);
  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  --vis-axis-tick-label-color: var(--ui-text-dimmed);
  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
```

### 13.3 响应式宽度

使用 `useElementSize` 让图表跟随容器宽度变化：

```typescript
import { useElementSize } from '@vueuse/core'

const cardRef = useTemplateRef<HTMLElement>('cardRef')
const { width } = useElementSize(cardRef)

// 将 width 传递给 VisXYContainer
// <VisXYContainer :width="width" />
```

---

## 14. 键盘快捷键

### 14.1 全局快捷键

通过 Nuxt UI 提供的 `defineShortcuts()` 注册：

```typescript
defineShortcuts({
  'g-h': () => router.push('/'),           // g 然后 h → 跳转首页
  'g-i': () => router.push('/inbox'),      // g 然后 i → 跳转收件箱
  'g-c': () => router.push('/customers'),  // g 然后 c → 跳转客户
  'g-s': () => router.push('/settings'),   // g 然后 s → 跳转设置
  'n': () => isOpen.value = !isOpen.value   // n → 切换通知面板
})
```

**语法说明**：
- `g-h` 表示先按 `g`，再按 `h`（序列快捷键）
- `meta-k` 表示 `Cmd+K`（Mac）/ `Ctrl+K`（Windows）
- `shift-n` 表示 `Shift+N`

### 14.2 组件级快捷键

在 `InboxList.vue` 中使用 `defineShortcuts` 注册上下箭头导航：

```typescript
defineShortcuts({
  arrowdown: () => {
    const index = mails.findIndex(mail => mail.id === selectedMail.value?.id)
    if (index < mails.length - 1) {
      selectedMail.value = mails[index + 1]
    }
  },
  arrowup: () => {
    const index = mails.findIndex(mail => mail.id === selectedMail.value?.id)
    if (index > 0) {
      selectedMail.value = mails[index - 1]
    }
  }
})
```

### 14.3 快捷键提示

使用 `UTooltip` 的 `shortcuts` prop 显示快捷键提示：

```vue
<UTooltip text="Notifications" :shortcuts="['N']">
  <UButton icon="i-lucide-bell" @click="openNotifications" />
</UTooltip>
```

---

## 15. 暗色模式

### 15.1 实现方式

暗色模式通过 VueUse 的 `useColorMode()` 实现，自动处理：

1. 系统偏好检测（`prefers-color-scheme`）
2. localStorage 持久化（key: `vueuse-color-scheme`）
3. HTML `<html>` 标签的 `dark` class 切换

### 15.2 使用方式

```typescript
import { useColorMode } from '@vueuse/core'

const colorMode = useColorMode()

// 读取当前模式
console.log(colorMode.value)  // 'light' | 'dark' | 'auto'

// 切换模式
colorMode.value = 'dark'
colorMode.value = 'light'
colorMode.value = 'auto'  // 跟随系统
```

### 15.3 防闪烁

`index.html` 中包含一段内联脚本，在 Vue 应用加载前就应用暗色模式，避免白屏闪烁：

```html
<script>
  var mode = localStorage.getItem('vueuse-color-scheme') || 'auto'
  var dark = mode === 'dark' || (mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  if (dark) {
    document.documentElement.classList.add('dark')
    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#18181b')
  }
</script>
```

### 15.4 主题切换 UI

`UserMenu.vue` 中提供了完整的主题切换功能：
- 17 种主色调选择
- 5 种中性色选择
- Light / Dark 外观切换

---

## 16. TypeScript 类型体系

### 16.1 领域类型

所有业务数据类型定义在 `src/types/index.d.ts`：

```typescript
import type { AvatarProps } from '@nuxt/ui'

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'
export type SaleStatus = 'paid' | 'failed' | 'refunded'

export interface User {
  id: number
  name: string
  email: string
  avatar?: AvatarProps      // 复用 Nuxt UI 的 Avatar props 类型
  status: UserStatus
  location: string
}

export interface Mail {
  id: number
  unread?: boolean
  from: User
  subject: string
  body: string
  date: string
}

export interface Member {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: AvatarProps
}

export interface Notification {
  id: number
  unread?: boolean
  sender: User
  body: string
  date: string
}

export type Period = 'daily' | 'weekly' | 'monthly'
export interface Range { start: Date; end: Date }
```

### 16.2 Nuxt UI 类型导入

Nuxt UI 的类型**需要手动 import**（不像组件那样自动导入）：

```typescript
import type { TableColumn } from '@nuxt/ui'           // 表格列定义
import type { NavigationMenuItem } from '@nuxt/ui'     // 导航菜单项
import type { DropdownMenuItem } from '@nuxt/ui'       // 下拉菜单项
import type { FormSubmitEvent } from '@nuxt/ui'        // 表单提交事件
import type { AvatarProps } from '@nuxt/ui'            // Avatar props
```

### 16.3 satisfies 操作符

项目大量使用 TypeScript 的 `satisfies` 进行类型检查而不丢失字面量推导：

```typescript
const links = [[{
  label: 'Home',
  icon: 'i-lucide-house',
  to: '/'
}]] satisfies NavigationMenuItem[][]
// links 的类型保留了具体的字面量值，同时确保满足 NavigationMenuItem[][] 约束
```

---

## 17. 常见开发任务

### 17.1 添加新页面

```bash
# 1. 创建文件
touch src/pages/analytics.vue
```

```vue
<!-- src/pages/analytics.vue -->
<script setup lang="ts">
// 你的逻辑
</script>

<template>
  <UDashboardPanel id="analytics">
    <template #header>
      <UDashboardNavbar title="Analytics">
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

```typescript
// 2. 在 src/layouts/default.vue 中添加导航链接
const links = [[
  // ...existing links
  {
    label: 'Analytics',
    icon: 'i-lucide-chart-bar',
    to: '/analytics'
  }
]]
```

### 17.2 添加新组件

```bash
# 创建组件文件
touch src/components/analytics/AnalyticsChart.vue
```

```vue
<!-- src/components/analytics/AnalyticsChart.vue -->
<script setup lang="ts">
defineProps<{
  title: string
  data: number[]
}>()
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold text-highlighted">{{ title }}</h3>
    </template>
    <!-- 图表内容 -->
  </UCard>
</template>
```

在页面中直接使用（**不需要 import**，如果你的 Vite 配置中启用了自定义组件自动导入；否则需要手动 import）：

```vue
<script setup>
import AnalyticsChart from '../components/analytics/AnalyticsChart.vue'
</script>

<template>
  <AnalyticsChart title="Revenue" :data="revenueData" />
</template>
```

> **注意**：只有 Nuxt UI 的 `U*` 组件是自动导入的。自定义组件需要手动 import。

### 17.3 添加模态弹窗

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <!-- 触发器 -->
  <UModal v-model:open="open" title="确认操作" description="此操作不可撤销">
    <UButton label="打开弹窗" />

    <template #body>
      <p>确定要执行此操作吗？</p>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton label="取消" color="neutral" variant="subtle" @click="open = false" />
        <UButton label="确认" color="error" @click="handleConfirm" />
      </div>
    </template>
  </UModal>
</template>
```

### 17.4 添加 Toast 通知

```typescript
const toast = useToast()

// 成功提示
toast.add({
  title: 'Success',
  description: 'Operation completed',
  icon: 'i-lucide-check',
  color: 'success'
})

// 错误提示
toast.add({
  title: 'Error',
  description: 'Something went wrong',
  color: 'error'
})

// 带操作按钮的提示
toast.add({
  title: 'New notification',
  duration: 0,  // 不自动关闭
  actions: [{
    label: 'View',
    onClick: () => router.push('/inbox')
  }]
})
```

### 17.5 添加带嵌套路由的页面

```
src/pages/
├── reports.vue              # 父路由布局
└── reports/
    ├── index.vue            # /reports
    ├── daily.vue            # /reports/daily
    └── monthly.vue          # /reports/monthly
```

```vue
<!-- src/pages/reports.vue -->
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const links = [[
  { label: 'Overview', to: '/reports', exact: true, icon: 'i-lucide-layout-dashboard' },
  { label: 'Daily', to: '/reports/daily', icon: 'i-lucide-calendar' },
  { label: 'Monthly', to: '/reports/monthly', icon: 'i-lucide-calendar-range' }
]] satisfies NavigationMenuItem[][]
</script>

<template>
  <UDashboardPanel id="reports">
    <template #header>
      <UDashboardNavbar title="Reports">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar>
        <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <RouterView />
    </template>
  </UDashboardPanel>
</template>
```

### 17.6 自定义侧边栏

在 `src/layouts/default.vue` 中修改 `links` 数组：

```typescript
const links = [[
  // 一级导航项
  {
    label: 'Home',
    icon: 'i-lucide-house',
    to: '/'
  },
  // 带子菜单的导航项
  {
    label: 'Settings',
    icon: 'i-lucide-settings',
    to: '/settings',
    type: 'trigger',       // 标记为可展开
    defaultOpen: true,     // 默认展开
    children: [
      { label: 'General', to: '/settings', exact: true },
      { label: 'Members', to: '/settings/members' }
    ]
  },
  // 带徽章的导航项
  {
    label: 'Inbox',
    icon: 'i-lucide-inbox',
    to: '/inbox',
    badge: '4'             // 数字徽章
  }
], [
  // 第二组：底部固定的链接
  {
    label: 'Help',
    icon: 'i-lucide-info',
    to: 'https://example.com',
    target: '_blank'
  }
]] satisfies NavigationMenuItem[][]
```

---

## 18. 构建与部署

### 18.1 构建

```bash
pnpm build
# 输出目录: dist/
```

### 18.2 Vercel 部署

项目已配置 `vercel.json`，将所有路由重写到 `index.html`（SPA 回退）：

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

推送到 Git 后 Vercel 自动部署。

### 18.3 其他平台部署

对于任何静态托管平台（Netlify、GitHub Pages、Nginx 等），需要配置 SPA 回退规则：

**Nginx 示例：**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Netlify：**  
创建 `public/_redirects`：
```
/*    /index.html   200
```

### 18.4 CI/CD

GitHub Actions 配置在 `.github/workflows/ci.yml`，每次 push 触发：

1. 安装 pnpm + Node 22
2. `pnpm install`
3. `pnpm lint` -- ESLint 检查
4. `pnpm build` -- 构建验证
5. `pnpm typecheck` -- TypeScript 类型检查

---

## 19. 项目约定与规范

### 19.1 代码风格

| 项目 | 约定 |
|------|------|
| 缩进 | 2 空格 |
| 行尾 | LF（Unix 风格） |
| 字符编码 | UTF-8 |
| 分号 | 无（ESLint 默认） |
| 引号 | 单引号（ESLint 默认） |
| 组件命名 | 允许单词组件名（`vue/multi-word-component-names: off`） |
| 模板属性 | 单行最多 3 个属性 |

### 19.2 文件组织约定

- **页面组件**：`src/pages/` -- 文件名即路由路径
- **可复用组件**：`src/components/` -- 按功能域分目录（`home/`, `inbox/`, `customers/`, `settings/`）
- **组合式函数**：`src/composables/` -- `use` 前缀
- **类型定义**：`src/types/` -- `.d.ts` 文件
- **工具函数**：`src/utils/`

### 19.3 组件编写约定

- 始终使用 `<script setup lang="ts">`
- Props 使用 `defineProps<T>()` 泛型语法
- Emits 使用 `defineEmits<T>()`
- 优先使用 Nuxt UI 组件而非自建
- 模板中使用 Tailwind 工具类，避免 CSS 模块

### 19.4 Dashboard 页面标准结构

每个页面应遵循这个结构模式：

```vue
<template>
  <UDashboardPanel id="unique-id">
    <!-- 顶部导航栏 -->
    <template #header>
      <UDashboardNavbar title="Page Title">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <!-- 操作按钮 -->
        </template>
      </UDashboardNavbar>

      <!-- 可选：工具栏 -->
      <UDashboardToolbar>
        <!-- 筛选器、标签页等 -->
      </UDashboardToolbar>
    </template>

    <!-- 主体内容 -->
    <template #body>
      <!-- 页面内容 -->
    </template>
  </UDashboardPanel>
</template>
```

---

## 20. 常见问题（FAQ）

### Q: 为什么项目叫 nuxt-app 但不是 Nuxt 项目？

项目使用 **Nuxt UI** 组件库，但运行在纯 **Vite + Vue 3** 环境中。Nuxt UI v4 支持在非 Nuxt 项目中独立使用。

### Q: 为什么模板中的 UButton 等组件没有 import？

Nuxt UI 的 Vite 插件（`@nuxt/ui/vite`）自动注册了所有 `U*` 组件和内置 composable（如 `useToast`）。构建时自动解析，无需手动导入。

### Q: 自定义组件（非 U* 前缀）需要 import 吗？

是的。只有 Nuxt UI 的 `U*` 组件和 composable 是自动导入的。自定义组件如 `TeamsMenu`、`HomeChart` 等需要手动 import，或在页面中使用时 Vite 的 `unplugin-vue-components` 等插件自动解析（当前项目未配置此插件）。

不过，在 `src/layouts/default.vue` 中你会看到 `TeamsMenu`、`UserMenu`、`NotificationsSlideover` 直接使用而未 import -- 这是因为 Nuxt UI 的 Vite 插件也会扫描 `src/components/` 目录进行自动导入。

### Q: 如何添加新的全局快捷键？

在 `src/composables/useDashboard.ts` 的 `defineShortcuts` 中添加：

```typescript
defineShortcuts({
  // 已有的快捷键...
  'g-a': () => router.push('/analytics'),  // 新增
})
```

### Q: 为什么在 h() 渲染函数中使用 Nuxt UI 组件需要 resolveComponent？

自动导入只作用于 `<template>` 编译阶段。在 `<script>` 中的 `h()` 渲染函数里，需要通过 `resolveComponent()` 手动解析组件名称：

```typescript
const UBadge = resolveComponent('UBadge')
// 然后才能在 h() 中使用
h(UBadge, { color: 'success' }, () => 'Active')
```

### Q: 如何切换主题色？

**运行时切换**（用户操作）：`UserMenu.vue` 已实现，通过 `useAppConfig` 修改 `ui.colors.primary`。

**构建时默认值**：修改 `vite.config.ts` 中的 `ui()` 插件配置：

```typescript
ui({ ui: { colors: { primary: 'blue' } } })
```

### Q: 为什么某些组件使用 shallowRef 而非 ref？

对于不需要深度响应的对象（如日期范围 `Range`），使用 `shallowRef` 可以避免不必要的深度代理，提升性能：

```typescript
const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
```

### Q: 如何在开发中查看所有可用的 Nuxt UI 组件？

访问 Nuxt UI 官方文档（Vue 版本）：  
https://ui.nuxt.com/docs/getting-started/installation/vue

### Q: pnpm-workspace.yaml 中的 ignoredBuiltDependencies 是什么？

这些是构建时的二进制依赖，pnpm 会跳过它们的重复构建以加速安装：

```yaml
onlyBuiltDependenciesFile: node_modules/@nuxt/ui/pnpm-built-dependencies.json
ignoredBuiltDependencies:
  - '@tailwindcss/oxide'
  - esbuild
  - maplibre-gl
  - vue-demi
```
