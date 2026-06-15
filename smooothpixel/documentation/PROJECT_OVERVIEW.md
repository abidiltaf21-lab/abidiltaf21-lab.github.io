# Smooothpixel — بشپړه پروژې کتنه

## دا پروژه څه ده؟

**Smooothpixel** د **motion graphics، 2D/3D animation، او digital design** لپاره یو **پورټفولیو او creative studio ویب‌سایټ** دی. دا یوازې یو عام HTML template نه دی — دا یو **فعال full-stack اپلیکیشن** دی چې:

- عام خلکو ته کارونه، showreel، خدمات، ټیم، نظریات، قیمتونه او اړیکه ښیي
- ادمین ته د ټولې مینځپانګې د مدیریت لپاره CMS (Content Management System) برابروي
- د API له لارې ډیټابیس ته نښلېږي او Cloudinary کې رسنۍ (عکس/ویډیو) پورته کوي

برانډ: **SmooothPixel** — د **Abidullah Iltaf** پورټفولیو ([smooothpixel.com](https://smooothpixel.com)).

---

## د ریپازیتوري جوړښت

| فولډر | رول |
|--------|------|
| `smooothpixel/souce` | **اصلي frontend** — React 18، TypeScript، Vite 5 (یادونه: `souce` تایپو دی، `source` نه) |
| `Project/ReactApi` | **اصلي backend** — ASP.NET Core (.NET 10)، JWT auth، Swagger |
| `smooothpixel/documentation` | مستندات |
| `DELETABLE_FILES/backend` | **زاړه/غیرفعال** Express + MongoDB backend — اوس کار نه کوي؛ ReactApi کار کوي |

---

## Tech stack

### Frontend (`smooothpixel/souce`)

- React 18 + TypeScript + Vite 5
- React Router 6، Bootstrap 5، GSAP، Swiper، Isotope
- Axios (`src/lib/apiClient.ts`)، Recharts (admin)
- react-helmet-async (SEO)، Cloudinary (uploads)

### Backend (`Project/ReactApi`)

- ASP.NET Core (.NET 10)
- Controllers: Projects، Team، Services، Videos، Reviews، Pricing، Inbox، Visitors، Auth، SiteSettings، SocialAccounts
- Default URL: `https://localhost:7273`

### Environment (`.env` په `souce` کې)

- `VITE_API_BASE_URL` — API پته
- `VITE_CLOUDINARY_*` — Cloudinary keys

---

## اپلیکیشن څنګه کار کوي؟

### Boot flow

```
index.html → main.tsx → App.tsx → Routers.tsx
```

### عام (Public) پاڼې

| Route | موخه |
|-------|------|
| `/` | اصلي کور پاڼه |
| `/home-dark` | تیاره theme |
| `/projects`, `/project-details/:id` | پروژې |
| `/service`, `/services-details/:id` | خدمات |
| `/pricing`, `/contact`, `/resume` | قیمت، اړیکه، CV |
| `/blog-with-sidebar`, `/blog-single-with-sidebar/:id` | بلاګ (static JSON) |
| `/login` | ادمین ننوتل |

### کور پاڼې برخې (`Home.tsx`)

1. Banner → 2. Services → 3. Showreel → 4. Portfolio → 5. Facts → 6. Team → 7. Reviews → 8. Pricing → 9. About → 10. Contact → 11. Promo

### Admin CMS (`/admin/*`)

Dashboard، Projects، Services، Showreel، Team، Reviews، Pricing، Requests inbox، Categories، Media library، Site settings، Profile.

**Auth:** JWT token په `localStorage` کې (`adminToken`).

---

## مهمې ځانګړتیاوې

| ځانګړتیا | تشریح |
|----------|--------|
| Portfolio / Showreel | Isotope gallery، Cloudinary |
| Dynamic CMS | Admin له API څخه ټول بدلوي |
| Contact / Inbox | فورم → `/api/inbox` |
| Reviews | عام نظر + admin مدیریت |
| Pricing calculator | تعاملي قیمت |
| Site settings | Hero video، branding |
| Blog / Resume | ډیری وخت static JSON |

---

## د پروژې چلول

### یوازې frontend

```bash
cd smooothpixel/souce
npm install
npm run dev
```

### بشپړ stack

1. API: `dotnet run --project Project/ReactApi`
2. Frontend: `npm run dev` په `smooothpixel/souce` کې
3. Admin: `/login` → `/admin`

---

## د `src/` فولډر نقشه

```
src/
├── main.tsx, App.tsx, Routers.tsx
├── pages/          # homePages, innerPages, blogPages
├── components/     # Banner, Portfolio, Services, ...
├── admin/          # CMS UI
├── hooks/          # useProjects, useSettings, ...
├── context/        # AuthContext
├── services/       # api.ts
├── lib/            # apiClient.ts
└── assets/         # CSS, JSON fallbacks
```

---

English overview: [../../README.md](../../README.md)
