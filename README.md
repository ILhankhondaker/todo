# TaskFlow – Team Todo App

A lightweight, fully frontend-only task manager built with:
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** components (hand-crafted, no CLI needed)
- **localStorage** for persistence — no backend, no database

---

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build for Production

```bash
npm run build
npm start
```

---

## Features

- ✅ Add, edit, delete tasks
- ✅ Mark tasks complete / pending
- ✅ Task title, optional description
- ✅ Due date & time
- ✅ Priority: Low / Medium / High (color-coded)
- ✅ Overdue indicator (red border + clock icon)
- ✅ Create teams with custom names
- ✅ Add / remove team members
- ✅ Assign tasks to a team member
- ✅ Filter by priority, status, assigned member
- ✅ Search tasks by title
- ✅ Progress stats bar (total / completed / pending / high-priority)
- ✅ Pending / Completed tabs
- ✅ Fully responsive (mobile + desktop)
- ✅ Zero backend — all data in localStorage

---

## Folder Structure

```
taskflow/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page — all state wired here
│   └── globals.css         # Tailwind v4 + CSS custom properties
├── components/
│   ├── ui/                 # Radix-based shadcn primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── scroll-area.tsx
│   │   ├── tabs.tsx
│   │   └── dropdown-menu.tsx
│   ├── tasks/
│   │   ├── TaskCard.tsx      # Individual task card with hover actions
│   │   ├── TaskForm.tsx      # Add / edit dialog
│   │   ├── FilterBar.tsx     # Search + filter controls
│   │   ├── StatsBar.tsx      # Progress overview
│   │   ├── PriorityBadge.tsx # Color-coded priority pill
│   │   └── EmptyState.tsx    # Empty list placeholder
│   └── teams/
│       └── TeamManager.tsx   # Create teams & add/remove members
├── hooks/
│   ├── useLocalStorage.ts    # Generic localStorage hook (SSR-safe)
│   └── useAppStore.ts        # All CRUD operations for tasks & teams
├── types/
│   └── index.ts              # Task, Team, TeamMember, FilterState types
└── lib/
    └── utils.ts              # cn() utility (clsx + tailwind-merge)
```

---

## How localStorage Works

All data is stored under the key `taskflow_data` as a single JSON object:

```json
{
  "tasks": [...],
  "teams": [...]
}
```

### `hooks/useLocalStorage.ts`
A generic, SSR-safe hook:
- Reads from `localStorage` inside `useEffect` (avoids hydration mismatch)
- Returns `isLoaded` flag → app shows spinner until hydration completes
- `setValue` updates both React state and `localStorage` in one call

### `hooks/useAppStore.ts`
Domain-level store built on `useLocalStorage`:
- Exposes clean named operations: `addTask`, `updateTask`, `deleteTask`, `toggleTaskStatus`, `addTeam`, `addTeamMember`, etc.
- Every mutation calls `setState(prev => ...)` → automatically persisted
- Deleting a team clears all `teamId` / `assignedTo` references in tasks
- Removing a member clears their `assignedTo` assignments

---

## Customisation Tips

**Change primary colour:** Edit `--color-primary` in `app/globals.css`

**Add dark mode:** Add a `.dark` class block in `globals.css` with overridden `--color-*` values, and toggle `dark` class on `<html>`

**Persist to a real backend:** Replace `useLocalStorage` with API calls in `useAppStore.ts` — the interface stays identical
# todo
