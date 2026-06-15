# Smooothpixel Frontend

React + TypeScript + Vite app for the SmooothPixel portfolio and admin CMS.

## Prerequisites

- Node.js 18+
- Running API at `Project/ReactApi` (for live data and admin)

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your API URL and Cloudinary credentials
npm run dev
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` / `npm start` | Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base (default `https://localhost:7273/api`) |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `VITE_CLOUDINARY_API_KEY` | Cloudinary API key |
| `VITE_CLOUDINARY_API_SECRET` | Cloudinary API secret (admin uploads) |

Copy from [`.env.example`](.env.example). Never commit `.env`.

## Project layout

```
src/
├── main.tsx              # React root, Router, AuthProvider
├── App.tsx               # Global styles, preloader, visitor tracking
├── Routers.tsx           # Public routes
├── admin/                # CMS (/admin/*)
├── pages/                # Route page shells
├── components/           # UI sections (Banner, Portfolio, etc.)
├── hooks/                # Data hooks (useProjects, useSettings, ...)
├── context/AuthContext.tsx
├── services/api.ts       # API facade
└── lib/apiClient.ts      # Axios + JWT interceptor
```

## Routes

**Public:** `/`, `/projects`, `/service`, `/pricing`, `/contact`, `/resume`, blog routes, `/login`

**Admin:** `/admin`, `/admin/projects`, `/admin/services`, `/admin/showreel`, etc. (see `src/admin/index.tsx`)

## API client

- Base URL: `import.meta.env.VITE_API_BASE_URL`
- JWT: `localStorage.adminToken` attached as `Authorization: Bearer`
- All methods: `src/services/api.ts`

## Home page sections

`src/pages/homePages/Home.tsx` composes: Banner → Services → Showreel → Portfolio → Facts → Team → Reviews → Pricing → About → Contact → Promo.

## Full-stack run

1. Start API: `dotnet run --project ../../Project/ReactApi` from repo root
2. Start frontend: `npm run dev` here
3. Admin: http://localhost:5173/login (port may vary)

## Docs

- Repo overview: [../../README.md](../../README.md)
- Pashto overview: [../documentation/PROJECT_OVERVIEW.md](../documentation/PROJECT_OVERVIEW.md)
