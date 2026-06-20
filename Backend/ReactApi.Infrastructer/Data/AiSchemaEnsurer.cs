using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace ReactApi.Infrastructer.Data;

/// <summary>
/// Ensures that the SiteSettings table contains the required fields for the AI Assistant and Telegram chat.
/// Supports both local SQLite and production PostgreSQL.
/// </summary>
public static class AiSchemaEnsurer
{
    public static async Task EnsureAsync(ApplicationDbContext db, ILogger? logger = null)
    {
        if (db.Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
        {
            logger?.LogInformation("Applying AI Assistant schema check on SQLite database.");
            
            // SQLite alter table commands (we wrap each in try-catch in case columns already exist)
            try
            {
                await db.Database.ExecuteSqlRawAsync("ALTER TABLE \"SiteSettings\" ADD COLUMN \"TelegramLink\" TEXT NULL;");
                logger?.LogInformation("Added TelegramLink column to SQLite database.");
            }
            catch { /* Already exists */ }

            try
            {
                await db.Database.ExecuteSqlRawAsync("ALTER TABLE \"SiteSettings\" ADD COLUMN \"AiEnabled\" INTEGER NOT NULL DEFAULT 1;");
                logger?.LogInformation("Added AiEnabled column to SQLite database.");
            }
            catch { /* Already exists */ }

            try
            {
                await db.Database.ExecuteSqlRawAsync("ALTER TABLE \"SiteSettings\" ADD COLUMN \"AiApiKey\" TEXT NULL;");
                logger?.LogInformation("Added AiApiKey column to SQLite database.");
            }
            catch { /* Already exists */ }

            try
            {
                await db.Database.ExecuteSqlRawAsync("ALTER TABLE \"SiteSettings\" ADD COLUMN \"AiSystemPrompt\" TEXT NULL;");
                logger?.LogInformation("Added AiSystemPrompt column to SQLite database.");
            }
            catch { /* Already exists */ }

            try
            {
                await db.Database.ExecuteSqlRawAsync("ALTER TABLE \"SiteSettings\" ADD COLUMN \"AiWelcomeMessage\" TEXT NULL;");
                logger?.LogInformation("Added AiWelcomeMessage column to SQLite database.");
            }
            catch { /* Already exists */ }

            // Create Translations table if not exists
            try
            {
                await db.Database.ExecuteSqlRawAsync("""
                    CREATE TABLE IF NOT EXISTS "Translations" (
                        "Id" INTEGER PRIMARY KEY AUTOINCREMENT,
                        "LanguageCode" TEXT NOT NULL,
                        "Key" TEXT NOT NULL,
                        "Value" TEXT NOT NULL,
                        "Createdby" TEXT NULL,
                        "CreatedbyDate" TEXT NULL,
                        "Updatedby" TEXT NULL,
                        "UpdatedbyDate" TEXT NULL
                    );
                """);
                logger?.LogInformation("Ensured Translations table exists in SQLite database.");
            }
            catch (Exception ex)
            {
                logger?.LogError(ex, "Failed to ensure Translations table exists in SQLite database.");
            }
        }
        else
        {
            logger?.LogInformation("Applying AI Assistant schema check on PostgreSQL database.");
            
            // PostgreSQL alter table checks
            const string sql = """
                DO $$
                BEGIN
                    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'SiteSettings') THEN
                        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'SiteSettings' AND column_name = 'TelegramLink') THEN
                            ALTER TABLE "SiteSettings" ADD "TelegramLink" text NULL;
                        END IF;
                        
                        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'SiteSettings' AND column_name = 'AiEnabled') THEN
                            ALTER TABLE "SiteSettings" ADD "AiEnabled" boolean NOT NULL DEFAULT true;
                        END IF;

                        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'SiteSettings' AND column_name = 'AiApiKey') THEN
                            ALTER TABLE "SiteSettings" ADD "AiApiKey" text NULL;
                        END IF;

                        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'SiteSettings' AND column_name = 'AiSystemPrompt') THEN
                            ALTER TABLE "SiteSettings" ADD "AiSystemPrompt" text NULL;
                        END IF;

                        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'SiteSettings' AND column_name = 'AiWelcomeMessage') THEN
                            ALTER TABLE "SiteSettings" ADD "AiWelcomeMessage" text NULL;
                        END IF;
                    END IF;
                END $$;
                """;

            try
            {
                await db.Database.ExecuteSqlRawAsync(sql);
                logger?.LogInformation("AI Assistant PostgreSQL schema ensure completed.");
            }
            catch (Exception ex)
            {
                logger?.LogWarning(ex, "AI Assistant PostgreSQL schema ensure failed — continuing.");
            }

            // Create Translations table if not exists
            try
            {
                await db.Database.ExecuteSqlRawAsync("""
                    CREATE TABLE IF NOT EXISTS "Translations" (
                        "Id" SERIAL PRIMARY KEY,
                        "LanguageCode" text NOT NULL,
                        "Key" text NOT NULL,
                        "Value" text NOT NULL,
                        "Createdby" text NULL,
                        "CreatedbyDate" date NULL,
                        "Updatedby" text NULL,
                        "UpdatedbyDate" date NULL
                    );
                """);
                logger?.LogInformation("Ensured Translations table exists in PostgreSQL database.");
            }
            catch (Exception ex)
            {
                logger?.LogError(ex, "Failed to ensure Translations table exists in PostgreSQL database.");
            }
        }
    }
}
