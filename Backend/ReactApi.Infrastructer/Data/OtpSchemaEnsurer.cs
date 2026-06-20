using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace ReactApi.Infrastructer.Data;

/// <summary>
/// Ensures that the AspNetUsers table contains the required fields for Password Reset OTP.
/// Supports both local SQLite and production PostgreSQL.
/// </summary>
public static class OtpSchemaEnsurer
{
    public static async Task EnsureAsync(ApplicationDbContext db, ILogger? logger = null)
    {
        if (db.Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
        {
            logger?.LogInformation("Applying OTP schema check on SQLite database.");
            
            try
            {
                await db.Database.ExecuteSqlRawAsync("ALTER TABLE \"AspNetUsers\" ADD COLUMN \"OtpCode\" TEXT NULL;");
                logger?.LogInformation("Added OtpCode column to SQLite AspNetUsers.");
            }
            catch { /* Already exists */ }

            try
            {
                await db.Database.ExecuteSqlRawAsync("ALTER TABLE \"AspNetUsers\" ADD COLUMN \"OtpExpiry\" TEXT NULL;");
                logger?.LogInformation("Added OtpExpiry column to SQLite AspNetUsers.");
            }
            catch { /* Already exists */ }
        }
        else
        {
            logger?.LogInformation("Applying OTP schema check on PostgreSQL database.");
            
            const string sql = """
                DO $$
                BEGIN
                    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'AspNetUsers') THEN
                        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'AspNetUsers' AND column_name = 'OtpCode') THEN
                            ALTER TABLE "AspNetUsers" ADD "OtpCode" text NULL;
                        END IF;
                        
                        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'AspNetUsers' AND column_name = 'OtpExpiry') THEN
                            ALTER TABLE "AspNetUsers" ADD "OtpExpiry" timestamp with time zone NULL;
                        END IF;
                    END IF;
                END $$;
                """;

            try
            {
                await db.Database.ExecuteSqlRawAsync(sql);
                logger?.LogInformation("OTP PostgreSQL schema ensure completed.");
            }
            catch (Exception ex)
            {
                logger?.LogWarning(ex, "OTP PostgreSQL schema ensure failed — continuing.");
            }
        }
    }
}
