using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ReactApi.Infrastructer.Data;

/// <summary>
/// Applies inbox column changes when EF history is behind (avoids 500 on GET /api/inbox).
/// </summary>
public static class InboxSchemaEnsurer
{
    public static async Task EnsureAsync(ApplicationDbContext db, ILogger? logger = null)
    {
        const string sql = """
            IF OBJECT_ID(N'[dbo].[ClientRequests]', N'U') IS NOT NULL
            BEGIN
                IF COL_LENGTH(N'dbo.ClientRequests', N'IsRead') IS NULL
                    ALTER TABLE [dbo].[ClientRequests] ADD [IsRead] bit NOT NULL CONSTRAINT [DF_ClientRequests_IsRead] DEFAULT(0);

                IF COL_LENGTH(N'dbo.ClientRequests', N'Phone') IS NULL
                    ALTER TABLE [dbo].[ClientRequests] ADD [Phone] nvarchar(max) NULL;

                IF COL_LENGTH(N'dbo.ClientRequests', N'Telegram') IS NULL
                    ALTER TABLE [dbo].[ClientRequests] ADD [Telegram] nvarchar(max) NULL;
            END
            """;

        try
        {
            await db.Database.ExecuteSqlRawAsync(sql);
            logger?.LogInformation("Inbox schema ensure completed (IsRead, Phone, Telegram).");
        }
        catch (Exception ex)
        {
            logger?.LogError(ex, "Failed to ensure inbox schema on ClientRequests.");
            throw;
        }
    }
}
