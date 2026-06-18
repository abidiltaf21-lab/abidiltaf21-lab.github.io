using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ReactApi.Infrastructer.Data;

/// <summary>
/// Applies inbox column changes when EF history is behind (avoids 500 on GET /api/inbox).
/// Rewritten for PostgreSQL (Railway deployment).
/// </summary>
public static class InboxSchemaEnsurer
{
    public static async Task EnsureAsync(ApplicationDbContext db, ILogger? logger = null)
    {
        if (db.Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
        {
            logger?.LogInformation("Skipping PostgreSQL inbox schema check on SQLite database.");
            return;
        }
        // PostgreSQL-compatible: add columns if they don't exist
        const string sql = """
            DO $$
            BEGIN
                IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ClientRequests') THEN
                    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'ClientRequests' AND column_name = 'IsRead') THEN
                        ALTER TABLE "ClientRequests" ADD "IsRead" boolean NOT NULL DEFAULT false;
                    END IF;

                    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'ClientRequests' AND column_name = 'Phone') THEN
                        ALTER TABLE "ClientRequests" ADD "Phone" text NULL;
                    END IF;

                    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'ClientRequests' AND column_name = 'Telegram') THEN
                        ALTER TABLE "ClientRequests" ADD "Telegram" text NULL;
                    END IF;
                END IF;
            END $$;
            """;

        try
        {
            await db.Database.ExecuteSqlRawAsync(sql);
            logger?.LogInformation("Inbox schema ensure completed (IsRead, Phone, Telegram).");
        }
        catch (Exception ex)
        {
            logger?.LogWarning(ex, "Inbox schema ensure failed — continuing (table may not exist yet).");
            // Don't throw — EnsureCreated handles the schema on first boot
        }
    }
}
