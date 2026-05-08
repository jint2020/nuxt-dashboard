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

This is a **Vite + Vue 3 dashboard framework shell** (not Nuxt, despite the repo name) built with [Nuxt UI v4](https://ui.nuxt.com/docs/getting-started/installation/vue) as the component library. All demo pages and mock data have been stripped — only the core framework infrastructure remains.

### Project structure

```
src/
├── main.ts                          # App entry (router, plugins)
├── App.vue                          # Root component (UApp + dark mode)
├── layouts/default.vue              # Dashboard shell (sidebar, search, notifications)
├── pages/index.vue                  # Home page (empty panel)
├── components/
│   ├── TeamsMenu.vue                # Sidebar header — team selector
│   ├── UserMenu.vue                 # Sidebar footer — user menu, theme/appearance switcher
│   └── NotificationsSlideover.vue   # Notification panel (empty state)
├── composables/useDashboard.ts      # Shared state + keyboard shortcuts
├── types/index.d.ts                 # Domain types (currently empty)
└── assets/css/main.css              # Tailwind + Nuxt UI + custom green palette
```

### Routing

File-based routing via `vue-router/vite` — files in `src/pages/` map directly to routes. Currently only `/` exists. Layouts are applied via `vite-plugin-vue-layouts`; the only layout is `src/layouts/default.vue`.

### Nuxt UI auto-imports

`@nuxt/ui` registers all `U*` components and composables (`useToast`, `defineShortcuts`, `useColorMode`, `useAppConfig`, etc.) globally — no manual imports needed. Custom components in `src/components/` are also auto-imported by the plugin.

### State / composables

`src/composables/useDashboard.ts` is the central shared composable (via `createSharedComposable`). It manages:
- `isNotificationsSlideoverOpen` — notifications panel state
- Keyboard shortcuts: `g-h` (go home), `n` (toggle notifications)

### Data

No external API calls or mock data. The project is a clean framework shell ready for custom backend integration.

### Styling

Tailwind CSS v4. Primary color is `green`, neutral is `zinc` (configured in `vite.config.ts` → `ui()` plugin). Font is `system-ui` (no external font loading). No external network dependencies — fully offline-capable.

### UI Language

All user-facing text is hardcoded in Chinese (中文). No i18n library is used.

### Types

`src/types/index.d.ts` is currently empty (`export {}`). Add domain types here as the project grows.
