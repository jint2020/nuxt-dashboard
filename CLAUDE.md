# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install       # Install dependencies
pnpm dev           # Dev server at http://localhost:5173
pnpm build         # Production build
pnpm preview       # Preview production build
pnpm lint          # ESLint (src/)
pnpm typecheck     # vue-tsc type check
```

No test suite is configured in this project.

## Architecture

This is a **Vite + Vue 3 dashboard** (not Nuxt, despite the repo name) built with [Nuxt UI v4](https://ui.nuxt.com/docs/getting-started/installation/vue) as the component library.

### Routing

File-based routing via `vite-plugin-vue-router` — files in `src/pages/` map directly to routes. Layouts are applied via `vite-plugin-vue-layouts`; the only layout is `src/layouts/default.vue`, which wraps all pages in a collapsible/resizable `UDashboardGroup` sidebar shell.

### Nuxt UI auto-imports

`@nuxt/ui` registers all `U*` components and composables (`useToast`, `defineShortcuts`, `useColorMode`, etc.) globally — no manual imports are needed for them. These are resolved at build time by the Vite plugin.

### State / composables

`src/composables/useDashboard.ts` is the central shared composable (via `createSharedComposable`). It owns the notifications slideover open state and registers keyboard shortcuts:
- `g-h/g-i/g-c/g-s` — navigate to Home/Inbox/Customers/Settings
- `n` — toggle notifications slideover

### Data

Pages fetch data directly from the external API at `https://dashboard-template.nuxt.dev/api/` using `@vueuse/core`'s `useFetch`. There is no local backend or store.

### Tables (Customers page)

The customers table uses `@tanstack/table-core` (headless) wired to `UTable`. Column definitions use `h()` render functions to embed `UAvatar`, `UBadge`, `UButton`, etc. — Nuxt UI components must be resolved via `resolveComponent()` inside `<script setup>` before use in render functions.

### Styling

Tailwind CSS v4. Primary color is `green`, neutral is `zinc` (configured in `vite.config.ts` → `ui()` plugin). Utility classes are used directly; no CSS modules.

### Types

All domain types (`User`, `Mail`, `Member`, `Sale`, `Notification`, `Stat`, `Period`, `Range`) are defined in `src/types/index.d.ts`.
