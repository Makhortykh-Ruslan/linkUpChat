# LinkUp Chat

A real-time chat application built as a personal sandbox project to explore and practice with modern web technologies: **Next.js**, **Supabase**, and **Tailwind CSS**.

## Why this project?

The goal was simple — pick three tools I wanted to get hands-on experience with and build something real with them. An online chat felt like a great fit: it touches auth, real-time data, file storage, and UI all at once.

## Features

- Authentication (sign up / sign in)
- Real-time messaging via Supabase Realtime
- Create direct conversations with other users
- Profile settings (avatar, name, email, password, theme)
- Dark / light mode
- Multilingual UI (English, Ukrainian, Polish)
- Mobile-responsive layout

## Tech Stack

| Layer           | Technology                                        |
| --------------- | ------------------------------------------------- |
| Framework       | Next.js 16 (App Router)                           |
| Backend & Auth  | Supabase (PostgreSQL + Auth + Realtime + Storage) |
| Styling         | Tailwind CSS 4                                    |
| Forms           | React Hook Form + Zod                             |
| i18n            | next-intl                                         |
| Package manager | pnpm                                              |

## Architecture

The project follows **Layered Architecture** with elements of **Clean Architecture** — a strict separation of concerns across four layers:

```
┌─────────────────────────────────────┐
│         Presentation Layer          │  app/ — pages, layouts, components
├─────────────────────────────────────┤
│        Business Logic Layer         │  core/services/ — server actions
├─────────────────────────────────────┤
│         Data Access Layer           │  infrastructure/supabase/repositories/
├─────────────────────────────────────┤
│        Infrastructure Layer         │  infrastructure/supabase/ — client setup
└─────────────────────────────────────┘
```

### Key principles

**Server Components first** — pages and layouts are async server components by default. Data is fetched on the server and passed to client components as props. Client components handle only interactivity.

**Repository pattern** — each Supabase table has a dedicated repository. Services orchestrate repositories; components never access the database directly.

**Unidirectional data flow:**

```
Page (Server Component)
  → Service (server action, business logic)
    → Repository (Supabase query)
      → DTO returned to component
        → Client Component (UI + interaction)
          → useActionInterceptor (wraps mutations, handles alerts)
```

**Typed responses** — all server actions return `ResponseModel<T>` with `success`, `message`, `description`, and `data` fields. Errors surface automatically via `AlertContext`.

### Folder structure

```
src/
├── app/
│   └── [locale]/
│       ├── auth/               # sign-in, sign-up
│       └── (main)/
│           ├── chat/           # conversation list + [conversationId]
│           └── settings/       # profile, password, preferences
├── core/
│   ├── components/             # shared UI kit (Button, Input, Modal…)
│   ├── services/               # server actions (auth, user, conversation, message)
│   ├── adapters/               # Model → DTO transformations
│   ├── models/                 # domain types
│   ├── dto/                    # data transfer objects
│   ├── types/                  # shared TypeScript types
│   ├── context/                # ThemeContext, AlertContext
│   ├── hooks/                  # useActionInterceptor
│   ├── validations/            # Zod schemas
│   └── utils/                  # debounce, formatTime, generateId…
└── infrastructure/
    └── supabase/
        ├── server.supabase.ts  # SSR client
        └── repositories/       # one repository per table
```

### Path aliases

| Alias               | Resolves to            |
| ------------------- | ---------------------- |
| `@core/*`           | `src/core/*`           |
| `@infrastructure/*` | `src/infrastructure/*` |
| `@/*`               | project root           |

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment variables

Create a `.env.local` file:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
```

## Scripts

| Command             | Description                      |
| ------------------- | -------------------------------- |
| `pnpm dev`          | Start development server         |
| `pnpm build`        | Production build                 |
| `pnpm lint`         | ESLint + folder naming check     |
| `pnpm lint:fix`     | Auto-fix ESLint errors           |
| `pnpm lint:folders` | Check folder naming conventions  |
| `pnpm format`       | Format all files with Prettier   |
| `pnpm format:check` | Check formatting without changes |

## AI Integration

Pull requests are automatically reviewed by **Claude (claude-opus-4-7)** via a GitHub Actions workflow.

On every opened or updated PR the workflow:

1. Extracts the git diff (TypeScript, JavaScript, CSS — config files excluded)
2. Sends it to the Claude API along with a set of project-specific review rules
3. Posts the result as a comment on the PR, grouped by severity: 🔴 Critical, 🟡 Warning, 🟢 Suggestion

The review script lives in [`scripts/pr/review-pr.mjs`](scripts/pr/review-pr.mjs) and the prompt template in [`scripts/pr/review-prompt.md`](scripts/pr/review-prompt.md).

## Deploy

Deployed on [Vercel](https://vercel.com).
