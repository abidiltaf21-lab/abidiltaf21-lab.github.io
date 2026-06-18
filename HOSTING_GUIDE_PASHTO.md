# SmooothPixel — د Vercel او Render وړیا هاست کولو بشپړ لارښود

> دا لارښود د `C:\Users\abidu\OneDrive\Desktop\host smoothpixel` پروژې لپاره دی.
> ټول ګامونه **وړیا** دي او سایټ به **ډېر ګړندی** ولود شي (Vercel CDN + Brotli + Code splitting).

---

## ۱. لومړی خبر: Vercel یوازې Frontend کوربه کوي

ستا پروژه **Full-Stack** ده:

| برخه | ټیکنالوژي | چېرته به کوربه شي |
|------|-----------|------------------|
| `Frontend/souce/` | React 18 + Vite 5 + TypeScript | **Vercel** ✅ (وړیا) |
| `Backend/` | ASP.NET Core .NET 10 | **Render** ✅ (وړیا، Docker) |
| ډیټابیس | PostgreSQL | **Neon** ✅ (وړیا تل دپاره) |
| رسنۍ (عکس/ویډیو) | Cloudinary | **Cloudinary Free Tier** ✅ (25 credits/میاشت) |

**ولې Vercel به Backend ونه کوربه کوي؟** ځکه چې Vercel د .NET ملاتړ نه کوي — یوازې Node.js، Python، Go، Ruby. نو موږ Backend د **Render.com** ته لېږو چې Docker ملاتړ کوي او وړیا پلان لري.

---

## ۲. د ټول ځای لنډیز (Architecture)

```
[کارن]  →  https://smooothpixel.com (Vercel CDN)
              │
              ├── /            → static React app
              ├── /assets/     → optimized images, JS, CSS
              └── /api/*       → rewrites to ↓
                                    │
                                    ▼
                          https://api.smooothpixel.com (Render)
                                    │
                          ┌─────────┼─────────┐
                          ▼         ▼         ▼
                       Neon DB   Cloudinary   JWT Auth
                    (PostgreSQL)   (media)
```

د CORS مسأله: Backend ته به مو ویل شوي origin (Vercel URL) اضافه کړو.

---

## ۳. مخکې له مخکې چمتووالی (یوازې یو ځل)

### ۳.۱ حسابونه جوړ کړئ
1. **GitHub** — https://github.com (که نه لرې)
2. **Vercel** — https://vercel.com (د GitHub سره login)
3. **Render** — https://render.com (د GitHub سره login)
4. **Neon** — https://neon.tech (د GitHub سره login) — وړیا PostgreSQL
5. **Cloudinary** — لا دمخه شته ✅ (Cloud Name: `ddxrpqctk`)

### ۳.۲ Git نصب او پروژه init

PowerShell خلاصه کړه په پروژه root کې:

```powershell
cd "C:\Users\abidu\OneDrive\Desktop\host smoothpixel"
git init
git add .
git commit -m "Initial commit - SmooothPixel project"
```

بیا په GitHub کې یو نوی repository جوړ کړه (نوم یې مثلاً `smooothpixel` وټاکه، **Public** یا Private) او دې URL ته وصل یې کړه:

```powershell
git remote add origin https://github.com/<your-username>/smooothpixel.git
git branch -M main
git push -u origin main
```

> **مهم:** `.env` فایل باید د `.gitignore` کې وي! وګوره چې `Frontend/souce/.gitignore` کې `.env` لیست شوی وي — که نه، نو اضافه یې کړه. دا فایل به په Vercel کې د Environment Variables په توګه تنظیم شي.

---

## ۴. Backend — Render.com ته Deploy

### ۴.۱ ولې Render؟
- وړیا Docker hosting
- ستا `Backend/Dockerfile` او `Backend/render.yaml` لا دمخه جوړ شوي
- یوازې د څو env vars بدلولو ته اړتیا ده

### ۴.۲ د Render.com ګامونه
1. https://dashboard.render.com/select-repo?type=cd یا "New + → Blueprint"
2. د خپل GitHub repo (`smooothpixel`) سره وصل یې کړه
3. وټاکه: `Root Directory = Backend`, `Blueprint Name = smooothpixel-api`
4. Render به `render.yaml` ولولي او 2 services جوړ کړي:
   - `smooothpixel-api` (Docker web service)
   - `smooothpixel-db` (PostgreSQL — **دا لنډ مهاله وړیا ده، ۹۰ ورځې**)
5. **د ډیټابیس بدلول Neon ته (سپارښتنه):**
   - په Render کې `smooothpixel-db` حذف کړه
   - https://neon.tech → "Create Project" → copy `DATABASE_URL` connection string
   - په Render کې `smooothpixel-api` → Environment → `DATABASE_URL` ورزیاته کړه

### ۴.۳ د Backend Environment Variables (په Render کې)

```
ASPNETCORE_ENVIRONMENT=Production
Jwt__Key=                       # کلیک "Generate" - Render به خپل سره قوي key جوړ کړي
Jwt__Issuer=SmooothPixel
Jwt__Audience=SmooothPixelClients
Jwt__Subject=SmooothPixelAuth
Cloudinary__CloudName=ddxrpqctk
Cloudinary__ApiKey=963385473771588
Cloudinary__ApiSecret=          # خپل Cloudinary API Secret دلته وټاکه
Cloudinary__UploadPreset=smooothpixel_upload
Cloudinary__Folder=smooothpixel
Cors__AllowedOrigins__0=https://smooothpixel.vercel.app
Cors__AllowedOrigins__1=https://smooothpixel.com
Cors__AllowedOrigins__2=https://www.smooothpixel.com
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
```

> **یادونه:** د Render وړیا پلان کې سایټ ۱۵ دقیقې idle وروسته **sleep** کېږي. کارن کله چې راشي، ۳۰-۵۰ ثانیې وخت نیسي چې بیا راپورته شي. که دا ډېره مسئله ده، نو Railway (د 5 ډالرو وړیا credit/میاشت) یا Fly.io (وړیا tier) وکاروه.

### ۴.۴ د API Secret لاس ته راوړل
ستا `.env` کې د Cloudinary API Secret شته. دا بېرته ترلاسه کولو لپاره:
1. https://cloudinary.com/console
2. "Account Details" → "API Secret" (کلیک وکړه ښکاره کړي)

---

## ۵. Frontend — Vercel.com ته Deploy

### ۵.۱ ولې Vercel؟
- د React/Vite apps لپاره تر ټولو غوره (CDN، Brotli compression، Image optimization)
- وړیا unlimited deployments
- د Git push سره automatic deploy
- ستا `vercel.json` لا دمخه جوړ شوی ✅

### ۵.۲ د Vercel ګامونه
1. https://vercel.com/new سره login
2. "Import Project" → د GitHub repo وټاکئ (`smooothpixel`)
3. **مهم — Configure Project:**
   - **Root Directory:** `Frontend/souce` (د Vite چې دلته دی)
   - **Framework Preset:** Vite (auto-detect)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default)
   - **Install Command:** `npm install` (default)
4. **Environment Variables** (د deploy دمخه):
   ```
   VITE_API_BASE_URL=https://smooothpixel-api.onrender.com/api
   VITE_CLOUDINARY_CLOUD_NAME=ddxrpqctk
   VITE_CLOUDINARY_API_KEY=963385473771588
   ```
   > **VITE_CLOUDINARY_API_SECRET مه ږدئ!** دا باید یوازې Backend کې وي. Frontend کې به Browser ته لاګ شي.
5. کلیک "Deploy"
6. وروستۍ به 2-3 دقیقې وخت ونیسي. URL به وي: `https://smooothpixel.vercel.app`

### ۵.۳ وروسته له Deploy
- کله چې Render URL ترلاسه شو (مثلاً `https://smooothpixel-api.onrender.com`)، نو Vercel کې `VITE_API_BASE_URL` تازه کړه
- په Render کې `Cors__AllowedOrigins__0` هم تازه کړه چې Vercel URL شامل کړي
- بیا Vercel "Redeploy" وکړه

---

## ۶. د ګړندې لوډ لپاره Performance (لا دمخه ښه تنظیم شوی ✅)

ستا پروژه کې لا دمخه دا شته:
- ✅ **Manual chunk splitting** — `vite.config.ts` کې vendor chunks (react, gsap, swiper, recharts, axios)
- ✅ **Vercel CDN** — automatic global edge caching
- ✅ **Brotli compression** — Vercel default
- ✅ **SPA rewrites** — `vercel.json` کې `/(.*)` → `/`

د لا ښه کولو لپاره:

### ۶.۱ د عکسونو ګړندتیا
که تاسو د Cloudinary URL کاروئ، د `f_auto,q_auto,w_auto` اضافه کړئ:
```html
<img src="https://res.cloudinary.com/ddxrpqctk/image/upload/f_auto,q_auto,w_auto/v123/photo.jpg" />
```

### ۶.۲ Lazy Loading
React routes ته lazy loading اضافه کړه. په `Routers.tsx` کې:
```tsx
const Home = lazy(() => import('./pages/homePages/Home'));
const Projects = lazy(() => import('./pages/innerPages/Projects'));
// ...
```
او `<Suspense fallback={<Loader />}>` کې وټاکئ.

### ۶.۳ SEO لپاره
- `index.html` ته meta description، Open Graph tags، Twitter cards اضافه کړه
- `react-helmet-async` لا دمخه شته ✅
- Vercel کې Analytics (`@vercel/analytics`) لا دمخه شته ✅

### ۶.۴ سپارښتنه — بدیل: Vercel به Backend سره rewrite
که غواړئ د Vercel د ښکلا څخه ګټه پورته کړئ، د `vercel.json` کې proxy اضافه کړئ:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://smooothpixel-api.onrender.com/api/$1" },
    { "source": "/(.*)", "destination": "/" }
  ]
}
```
بیا Frontend کې `VITE_API_BASE_URL=/api` وټاکئ — Vercel به د API غوښتنلیکونه Render ته وروپېژني.

---

## ۷. ډیټابیس — Neon (وړیا تل دپاره)

1. https://neon.tech → "Sign up with GitHub"
2. "Create Project" → نوم `smooothpixel-db` وټاکئ → Region: Frankfurt (اروپا ته نږدې)
3. د connection string copy کړئ (لکه `postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`)
4. دا string په Render environment کې `DATABASE_URL` په توګه وټاکئ
5. **د Schema جوړولو:** Backend به په لومړي deploy کې خپل سره schema جوړ کړي (EF Core `EnsureCreatedAsync`)

---

## ۸. Cloudinary — د Media تنظیم

ستا حساب شته. وګوره:
1. https://cloudinary.com/console
2. د upload preset جوړول:
   - Settings → Upload → "Add upload preset"
   - Name: `smooothpixel_upload`
   - Signing mode: **Signed**
   - Folder: `smooothpixel`
   - Save
3. API Secret copy کړه او په Render env vars کې وټاکئ

---

## ۹. د لومړي Admin حساب جوړول

Backend deploy شو وروسته، `/api/auth/register` ته یو POST غوښتنه وکړه (د Postman یا curl سره):
```bash
curl -X POST https://smooothpixel-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"abid@example.com","password":"StrongPass!1","name":"Abid"}'
```

بیا https://smooothpixel.vercel.app/login ته لاړ شئ او admin token به ترلاسه شي.

---

## ۱۰. امنیتي خبرداري

> **خپل `.env` فایل مه commit کړئ!** دا لا دمخه د Vercel/Render environment variables کې تنظیم کېږي.
> **VITE_CLOUDINARY_API_SECRET** مه ږدئ په Frontend env vars کې — دا به browser کې لاګ شي! یوازې Backend env vars کې وټاکئ.
> **Jwt__Key** باید قوي وي (Render generateValue: true کاروي).

---

## ۱۱. د لګښت لنډیز (ټول وړیا!)

| خدمت | پلان | لګښت |
|------|------|------|
| Vercel (Frontend) | Hobby | 0 USD (وړیا) |
| Render (Backend) | Free | 0 USD (sleeps after 15 min idle) |
| Neon (DB) | Free | 0 USD (0.5 GB، تل وړیا) |
| Cloudinary (Media) | Free | 0 USD (25 credits/میاشت) |
| **مجموعه** | | **0 USD** ✅ |

---

## ۱۲. ګړندۍ چیک لیست

- [ ] GitHub repo جوړ کړه او push یې کړه
- [ ] Neon کې ډیټابیس جوړ کړه، DATABASE_URL copy کړه
- [ ] Render کې Blueprint deploy کړه
- [ ] Render env vars تنظیم کړه (Jwt__Key auto-generate)
- [ ] Render build چې بریالی شو، URL copy کړه
- [ ] Vercel کې Frontend deploy کړه (Root: `Frontend/souce`)
- [ ] Vercel env vars تنظیم کړه (VITE_API_BASE_URL = Render URL)
- [ ] Render CORS کې Vercel URL اضافه کړه
- [ ] Vercel redeploy کړه
- [ ] د سایټ ازموینه وکړه
- [ ] د admin register غوښتنه وکړه
- [ ] Custom domain وصل کړه (اختیاري)

---

## ۱۳. ګړندۍ شروع — خپل Termه واخیسته

که یوازې ګړندۍ ځواب غواړئ:
1. **Vercel:** GitHub repo → Import → Root = `Frontend/souce` → Deploy
2. **Render:** New Blueprint → GitHub repo → Root = `Backend` → Apply
3. **Neon:** Sign up → Create project → Copy DATABASE_URL → Paste په Render کې
4. **5-10 دقیقې** وروسته به ټول شی چل شي 🚀

---

**پوښتنې ولې؟** که په کوم ګام کې ستونزه درپیدا شوه، راوسه راته ووایاسته — زه به درسره یوځای حل یې کړو. 💪
