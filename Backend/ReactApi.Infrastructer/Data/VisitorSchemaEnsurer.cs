using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ReactApi.Infrastructer.Data;

namespace ReactApi.Infrastructer.Data
{
    public static class VisitorSchemaEnsurer
    {
        public static async Task EnsureAsync(ApplicationDbContext db, ILogger? logger = null)
        {
            var conn = db.Database.GetConnectionString() ?? "";
            bool isPostgres = conn.Contains("Host=") || conn.Contains("Port=");

            if (!isPostgres)
            {
                // SQLite — just add columns if missing
                try
                {
                    await db.Database.ExecuteSqlRawAsync(
                        "CREATE TABLE IF NOT EXISTS \"VisitorLogs\" (" +
                        "\"Id\" INTEGER NOT NULL CONSTRAINT \"PK_VisitorLogs\" PRIMARY KEY AUTOINCREMENT," +
                        "\"Country\" TEXT NULL," +
                        "\"CountryCode\" TEXT NULL," +
                        "\"City\" TEXT NULL," +
                        "\"Region\" TEXT NULL," +
                        "\"Page\" TEXT NULL," +
                        "\"Section\" TEXT NULL," +
                        "\"SessionId\" TEXT NULL," +
                        "\"IpAddress\" TEXT NULL," +
                        "\"VisitedAt\" TEXT NOT NULL" +
                        ");");
                    logger?.LogInformation("VisitorLogs table ensured (SQLite).");
                }
                catch { /* Already exists */ }
            }
            else
            {
                // PostgreSQL
                var sql = """
                DO $$
                BEGIN
                    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'VisitorLogs') THEN
                        CREATE TABLE "VisitorLogs" (
                            "Id" SERIAL PRIMARY KEY,
                            "Country" text NULL,
                            "CountryCode" text NULL,
                            "City" text NULL,
                            "Region" text NULL,
                            "Page" text NULL,
                            "Section" text NULL,
                            "SessionId" text NULL,
                            "IpAddress" text NULL,
                            "VisitedAt" timestamp with time zone NOT NULL DEFAULT NOW()
                        );
                        CREATE INDEX IF NOT EXISTS "IX_VisitorLogs_VisitedAt" ON "VisitorLogs" ("VisitedAt");
                        CREATE INDEX IF NOT EXISTS "IX_VisitorLogs_Country" ON "VisitorLogs" ("Country");
                    END IF;
                END $$;
                """;

                try
                {
                    await db.Database.ExecuteSqlRawAsync(sql);
                    logger?.LogInformation("VisitorLogs table ensured (PostgreSQL).");
                }
                catch (Exception ex)
                {
                    logger?.LogWarning(ex, "VisitorSchemaEnsurer: could not ensure VisitorLogs.");
                }
            }
        }
    }
}
