using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace ReactApi.Infrastructer.Data;

/// <summary>
/// Ensures the SiteSettings table has the columns needed for Email & Telegram notifications.
/// Supports both local SQLite and production PostgreSQL.
/// </summary>
public static class NotificationSchemaEnsurer
{
    public static async Task EnsureAsync(ApplicationDbContext db, ILogger? logger = null)
    {
        if (db.Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
        {
            logger?.LogInformation("Applying Notification schema check on SQLite database.");
            
            try
            {
                await db.Database.ExecuteSqlRawAsync("ALTER TABLE \"SiteSettings\" ADD COLUMN \"NotifyEmailEnabled\" INTEGER NOT NULL DEFAULT 0;");
                logger?.LogInformation("Added NotifyEmailEnabled column to SQLite SiteSettings.");
            }
            catch { /* Already exists */ }

            try
            {
                await db.Database.ExecuteSqlRawAsync("ALTER TABLE \"SiteSettings\" ADD COLUMN \"NotifyEmailAddress\" TEXT NULL;");
                logger?.LogInformation("Added NotifyEmailAddress column to SQLite SiteSettings.");
            }
            catch { /* Already exists */ }

            try
            {
                await db.Database.ExecuteSqlRawAsync("ALTER TABLE \"SiteSettings\" ADD COLUMN \"NotifyTelegramEnabled\" INTEGER NOT NULL DEFAULT 0;");
                logger?.LogInformation("Added NotifyTelegramEnabled column to SQLite SiteSettings.");
            }
            catch { /* Already exists */ }

            try
            {
                await db.Database.ExecuteSqlRawAsync("ALTER TABLE \"SiteSettings\" ADD COLUMN \"NotifyTelegramBotToken\" TEXT NULL;");
                logger?.LogInformation("Added NotifyTelegramBotToken column to SQLite SiteSettings.");
            }
            catch { /* Already exists */ }

            try
            {
                await db.Database.ExecuteSqlRawAsync("ALTER TABLE \"SiteSettings\" ADD COLUMN \"NotifyTelegramChatId\" TEXT NULL;");
                logger?.LogInformation("Added NotifyTelegramChatId column to SQLite SiteSettings.");
            }
            catch { /* Already exists */ }
        }
        else
        {
            logger?.LogInformation("Applying Notification schema check on PostgreSQL database.");
            
            const string sql = """
                DO $$
                BEGIN
                    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'SiteSettings') THEN
                        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'SiteSettings' AND column_name = 'NotifyEmailEnabled') THEN
                            ALTER TABLE "SiteSettings" ADD "NotifyEmailEnabled" boolean NOT NULL DEFAULT false;
                        END IF;
                        
                        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'SiteSettings' AND column_name = 'NotifyEmailAddress') THEN
                            ALTER TABLE "SiteSettings" ADD "NotifyEmailAddress" text NULL;
                        END IF;

                        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'SiteSettings' AND column_name = 'NotifyTelegramEnabled') THEN
                            ALTER TABLE "SiteSettings" ADD "NotifyTelegramEnabled" boolean NOT NULL DEFAULT false;
                        END IF;

                        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'SiteSettings' AND column_name = 'NotifyTelegramBotToken') THEN
                            ALTER TABLE "SiteSettings" ADD "NotifyTelegramBotToken" text NULL;
                        END IF;

                        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'SiteSettings' AND column_name = 'NotifyTelegramChatId') THEN
                            ALTER TABLE "SiteSettings" ADD "NotifyTelegramChatId" text NULL;
                        END IF;
                    END IF;
                END $$;
                """;

            try
            {
                await db.Database.ExecuteSqlRawAsync(sql);
                logger?.LogInformation("Notification PostgreSQL schema ensure completed.");
            }
            catch (Exception ex)
            {
                logger?.LogWarning(ex, "Notification PostgreSQL schema ensure failed — continuing.");
            }
        }
    }
}
