# Smooothpixel API (ReactApi)

ASP.NET Core Web API for the Smooothpixel portfolio CMS.

## Run

```bash
dotnet run --project Project/ReactApi
```

- HTTPS: `https://localhost:7273`
- Swagger: available in Development

## Configuration

- **Database:** `ConnectionStrings:DefaultConnection` in `appsettings.json` (default LocalDB)
- **JWT:** `Jwt` section in `appsettings.json`

## Controllers (routes under `/api`)

| Controller | Resource |
|------------|----------|
| PortfolioProjectsController | `/projects` |
| TeamMembersController | `/team` |
| ServicesController | `/services` |
| VideosController | `/videos` |
| VideoCategoriesController | `/VideoCategories` |
| ReviewsController | `/reviews` |
| PricingController | `/pricing` |
| ClientRequestsController | `/inbox` |
| VisitorsController | `/visitors` |
| SiteSettingsController | `/SiteSettings` |
| SocialAccountsController | `/SocialAccounts` |
| AuthController | `/auth` |

## Frontend

Point `VITE_API_BASE_URL` in `smooothpixel/souce/.env` to `https://localhost:7273/api`.

See [../../README.md](../../README.md) for full-stack setup.
