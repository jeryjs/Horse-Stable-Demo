# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      # Equus · Stable Operations

      Equus is a responsive horse-stable management frontend built with React 19, TypeScript, Vite, and current MUI/MUI X packages. It covers the practical assessment requirements without pretending to be a backend: horse profiles, activity history, dashboard metrics, search/filtering, and a transparent smart-care feature.

      ## Run locally

      Install dependencies with pnpm, then start the Vite development server:

      `pnpm install`

      `pnpm dev`

      Production validation uses:

      `pnpm build`

      `pnpm lint`

      ## Architecture

      - `src/pages` contains route-level orchestration for the dashboard, horse roster, horse profile, activity log, and not-found state.
      - `src/components` contains presentational layout, forms, timeline, metric, status, avatar, and intelligence components.
      - `src/hooks/useStableData.tsx` is the application data boundary. It exposes async CRUD methods and selectors like a future API repository, while the current implementation persists a complete snapshot in IndexedDB.
      - `src/hooks/useIndexedDb.ts` contains the browser persistence adapter. Pages and components do not access IndexedDB directly.
      - `src/hooks/useStableIntelligence.ts` derives activity-cadence and status insights from the same domain records. It is intentionally transparent and local, so a future recommendation service can replace the hook without changing page contracts.
      - `src/types/stable.ts` defines the domain model and input shapes used by both the local adapter and future backend integration.

      ## Routes

      - `/dashboard` — stable pulse, metrics, today’s activities, roster chart, and attention queue.
      - `/horses` — searchable/filterable MUI X Data Grid and horse creation workflow.
      - `/horses/:horseId` — horse profile, edit workflow, smart recommendation, and activity timeline.
      - `/activities` — global activity log with horse/type/search filters and activity creation.

      ## UI decisions

      The interface uses a stable-inspired visual language: parchment surfaces, deep ink navigation, sage care signals, and copper actions. It uses MUI theme tokens, component defaults, responsive Grid `size` props, Data Grid, Charts, Date Pickers, accessible dialogs, keyboard focus styling, and a three-mode theme switcher (`Light`, `Dark`, `System`). `System` is the default.

      Optional horse photos are stored as small data URLs inside the IndexedDB snapshot for a self-contained assessment demo. A production version should upload media and persist only a remote asset URL.
```
