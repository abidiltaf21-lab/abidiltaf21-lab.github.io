using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ReactApi.Domin.Commond_model;

namespace ReactApi.Infrastructer.Data;

/// <summary>
/// Creates ResumeEntries table when missing and seeds realistic defaults.
/// </summary>
public static class ResumeSchemaEnsurer
{
    public static async Task EnsureAsync(ApplicationDbContext db, ILogger? logger = null)
    {
        const string createTable = """
            IF OBJECT_ID(N'[dbo].[ResumeEntries]', N'U') IS NULL
            BEGIN
                CREATE TABLE [dbo].[ResumeEntries] (
                    [Id] int NOT NULL IDENTITY,
                    [Type] nvarchar(32) NOT NULL,
                    [Title] nvarchar(256) NOT NULL,
                    [Subtitle] nvarchar(256) NOT NULL,
                    [DateRange] nvarchar(64) NOT NULL,
                    [Description] nvarchar(max) NOT NULL,
                    [SortOrder] int NOT NULL CONSTRAINT [DF_ResumeEntries_SortOrder] DEFAULT(0),
                    [IsActive] bit NOT NULL CONSTRAINT [DF_ResumeEntries_IsActive] DEFAULT(1),
                    [TeamMemberId] int NULL,
                    [Createdby] nvarchar(max) NULL,
                    [CreatedbyDate] date NULL,
                    [Updatedby] nvarchar(max) NULL,
                    [UpdatedbyDate] date NULL,
                    CONSTRAINT [PK_ResumeEntries] PRIMARY KEY ([Id]),
                    CONSTRAINT [FK_ResumeEntries_TeamMembers_TeamMemberId] FOREIGN KEY ([TeamMemberId]) REFERENCES [dbo].[TeamMembers]([Id]) ON DELETE CASCADE
                );
            END
            """;

        const string alterTable = """
            IF OBJECT_ID(N'[dbo].[ResumeEntries]', N'U') IS NOT NULL AND COL_LENGTH(N'[dbo].[ResumeEntries]', N'TeamMemberId') IS NULL
            BEGIN
                ALTER TABLE [dbo].[ResumeEntries] ADD [TeamMemberId] int NULL;
                ALTER TABLE [dbo].[ResumeEntries] ADD CONSTRAINT [FK_ResumeEntries_TeamMembers_TeamMemberId] FOREIGN KEY ([TeamMemberId]) REFERENCES [dbo].[TeamMembers]([Id]) ON DELETE CASCADE;
            END
            """;

        try
        {
            await db.Database.ExecuteSqlRawAsync(createTable);
            await db.Database.ExecuteSqlRawAsync(alterTable);
            logger?.LogInformation("ResumeEntries schema ensure completed.");
        }
        catch (Exception ex)
        {
            logger?.LogError(ex, "Failed to ensure ResumeEntries table.");
            throw;
        }
    }

    public static async Task SeedDefaultsAsync(ApplicationDbContext db)
    {
        if (await db.ResumeEntries.AnyAsync()) return;

        var defaults = new List<ResumeEntry>
        {
            new()
            {
                Type = "experience",
                Title = "Senior Motion Designer",
                Subtitle = "SmooothPixel (Self-Founded)",
                DateRange = "2015 - Present",
                Description =
                    "Leading creative strategy and production for high-end explainer videos and brand motion graphics. Collaborating with international clients to translate complex ideas into compelling visual journeys.",
                SortOrder = 1,
                IsActive = true
            },
            new()
            {
                Type = "experience",
                Title = "Lead 2D Animator",
                Subtitle = "Creative Motion Studio",
                DateRange = "2010 - 2015",
                Description =
                    "Specialized in character animation and storyboard development. Managed a team of designers to deliver consistent, high-quality animation sequences for educational content and commercials.",
                SortOrder = 2,
                IsActive = true
            },
            new()
            {
                Type = "experience",
                Title = "Junior Graphic Designer",
                Subtitle = "Visual Arts Agency",
                DateRange = "2008 - 2010",
                Description =
                    "Focused on vector illustrations, brand visuals, and assisting in the early stages of motion graphic productions. Developed a strong foundation in visual storytelling.",
                SortOrder = 3,
                IsActive = true
            },
            new()
            {
                Type = "education",
                Title = "B.A. Graphic Design & Visual Communication",
                Subtitle = "National College of Arts, Lahore",
                DateRange = "2004 - 2008",
                Description =
                    "Studied visual communication, typography, and brand systems. Built the design foundation that later shaped a career in motion graphics and animated storytelling.",
                SortOrder = 1,
                IsActive = true
            },
            new()
            {
                Type = "education",
                Title = "Advanced Animation Certificate",
                Subtitle = "School of Motion",
                DateRange = "2011 - 2012",
                Description =
                    "Mastered professional animation principles, expression-driven workflows, and advanced visual effects techniques used in commercial motion design.",
                SortOrder = 2,
                IsActive = true
            },
            new()
            {
                Type = "education",
                Title = "Cinema 4D & 3D Motion Specialization",
                Subtitle = "Greyscalegorilla (Online)",
                DateRange = "2016",
                Description =
                    "Focused on 3D product visualization, lighting, and integrating Cinema 4D pipelines into broadcast-quality motion graphics for corporate and tech clients.",
                SortOrder = 3,
                IsActive = true
            }
        };

        db.ResumeEntries.AddRange(defaults);
        await db.SaveChangesAsync();
    }
}
