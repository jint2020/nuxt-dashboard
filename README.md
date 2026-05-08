# 工单处理后台

基于 Vite + Vue 3 + [Nuxt UI v4](https://ui.nuxt.com) 构建的后台管理系统。

## 技术栈

- **Vue 3** — Composition API + `<script setup>`
- **Vite** — 构建工具
- **Nuxt UI v4** — 组件库（Dashboard 组件 + 通用 UI）
- **Tailwind CSS v4** — 原子化 CSS
- **TypeScript** — 严格模式
- **Vue Router** — 文件系统路由

## 快速开始

```bash
pnpm install
pnpm dev
```

开发服务器运行在 `http://localhost:5173`。

## 可用脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 生产构建（输出到 `dist/`） |
| `pnpm preview` | 预览生产构建 |
| `pnpm lint` | ESLint 代码检查 |
| `pnpm typecheck` | TypeScript 类型检查 |

## 项目结构

```
src/
├── main.ts                       # 应用入口
├── App.vue                       # 根组件
├── layouts/default.vue           # Dashboard 布局（侧边栏 + 命令面板 + 通知）
├── pages/index.vue               # 首页
├── components/
│   ├── TeamsMenu.vue             # 团队选择器
│   ├── UserMenu.vue              # 用户菜单（含主题/外观切换）
│   └── NotificationsSlideover.vue # 通知面板
├── composables/useDashboard.ts   # 共享状态 + 快捷键
├── types/index.d.ts              # 类型定义
└── assets/css/main.css           # 样式入口
```

## 核心特性

- 可折叠/可调整宽度的侧边栏
- 全局命令面板（Ctrl/Cmd + K）
- 通知侧滑面板（快捷键 N）
- 主题色切换（17 种主色 + 5 种中性色）
- 明暗模式切换
- 文件系统路由（`src/pages/` 下的文件自动生成路由）
- 零外部网络依赖，支持内网部署

## 部署

项目构建为纯静态 SPA，部署到任意静态服务器即可。需配置 SPA 回退规则：

**Nginx：**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```
