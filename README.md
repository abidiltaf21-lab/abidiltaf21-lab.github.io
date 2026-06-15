# Smooothpixel

Full-stack **motion graphics portfolio** and creative studio website for [SmooothPixel](https://smooothpixel.com) — portfolio of Abidullah Iltaf. Public marketing site plus admin CMS backed by an ASP.NET Core API.

## What this project is

- **Public site:** showcase projects, showreel, services, team, reviews, pricing, and contact
- **Admin CMS:** manage all content via `/admin` (JWT auth)
- **API-driven:** React frontend talks to `Project/ReactApi`; media uploads via Cloudinary

This is not a static HTML template — it is an active full-stack application.

## Repository structure

```
smooothpixel/
├── smooothpixel/
│   ├── souce/              # React + Vite + TypeScript frontend (folder name typo: "souce")
│   └── documentation/      # Project docs (see PROJECT_OVERVIEW.md)
├── Project/
│   └── ReactApi/           # ASP.NET Core API (.NET 10)
└── DELETABLE_FILES/        # Legacy Express + MongoDB backend (unused; safe to remove)
```

| Folder | Role |
|--------|------|
| `smooothpixel/souce` | Main frontend |
| `Project/ReactApi` | Main backend (JWT, EF Core, Swagger) |
| `DELETABLE_FILES/backend` | Old Node/Mongo stack — replaced by ReactApi |

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | React 18, TypeScript, Vite 5, React Router 6, Bootstrap 5, GSAP, Swiper, Axios |
| Backend | ASP.NET Core, Entity Framework, JWT |
| Media | Cloudinary |
| Analytics | Visitor logging to API + optional Vercel Analytics |

## Quick start

### Frontend only

```bash
cd smooothpixel/souce
cp .env.example .env   # then edit values
npm install
npm run dev
```

### Full stack (CMS + live data)

1. **API** (from repo root):

   ```bash
   dotnet run --project Project/ReactApi
   ```

   Default: `https://localhost:7273` (Swagger in Development).

2. **Frontend:**

   ```bash
   cd smooothpixel/souce
   npm run dev
   ```

3. **Admin:** open `/login`, then `/admin`.

Without the API running, some sections use static JSON fallbacks or appear empty.

## Public routes

| Route | Purpose |
|-------|---------|
| `/` | Home (all sections) |
| `/home-dark` | Dark theme variant |
| `/projects`, `/project-details/:id` | Portfolio |
| `/service`, `/services-details/:id` | Services |
| `/pricing`, `/contact`, `/resume` | Pricing, contact, CV |
| `/blog-with-sidebar`, `/blog-single-with-sidebar/:id` | Blog (mostly static JSON) |
| `/login` | Admin login |

## Admin routes (`/admin/*`)

Dashboard, projects, services, showreel, team, reviews, pricing, requests inbox, categories, media library, site settings, profile.

## API overview

Frontend base URL: `VITE_API_BASE_URL` (default `https://localhost:7273/api`).

Main resources: `/projects`, `/team`, `/services`, `/videos`, `/reviews`, `/pricing`, `/inbox`, `/VideoCategories`, `/SocialAccounts`, `/SiteSettings`, `/visitors`, `/auth/*`.

See [`smooothpixel/souce/src/services/api.ts`](smooothpixel/souce/src/services/api.ts) for the full client facade.

## Documentation

- **English (this file):** repo overview and run instructions
- **Pashto overview:** [`smooothpixel/documentation/PROJECT_OVERVIEW.md`](smooothpixel/documentation/PROJECT_OVERVIEW.md)
- **Frontend dev guide:** [`smooothpixel/souce/README.md`](smooothpixel/souce/README.md)

## Boot flow

```
index.html → src/main.tsx → App.tsx → Routers.tsx
```

## License

MIT (see `smooothpixel/souce/package.json`).
