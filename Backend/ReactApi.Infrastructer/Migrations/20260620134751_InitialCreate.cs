using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ReactApi.Infrastructer.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    OtpCode = table.Column<string>(type: "TEXT", nullable: true),
                    OtpExpiry = table.Column<DateTime>(type: "TEXT", nullable: true),
                    OtpAttempts = table.Column<int>(type: "INTEGER", nullable: true),
                    UserName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "INTEGER", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: true),
                    SecurityStamp = table.Column<string>(type: "TEXT", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "TEXT", nullable: true),
                    PhoneNumber = table.Column<string>(type: "TEXT", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "INTEGER", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ClientRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Phone = table.Column<string>(type: "TEXT", nullable: true),
                    Telegram = table.Column<string>(type: "TEXT", nullable: true),
                    BudgetRange = table.Column<string>(type: "TEXT", nullable: true),
                    ProjectType = table.Column<string>(type: "TEXT", nullable: true),
                    Message = table.Column<string>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: true),
                    IsRead = table.Column<bool>(type: "INTEGER", nullable: false),
                    InternalNotes = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Createdby = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    Updatedby = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientRequests", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PortfolioProjects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    VideoUrl = table.Column<string>(type: "TEXT", nullable: true),
                    Thumb = table.Column<string>(type: "TEXT", nullable: true),
                    ThumbFull = table.Column<string>(type: "TEXT", nullable: true),
                    Tags = table.Column<string>(type: "TEXT", nullable: true),
                    Views = table.Column<int>(type: "INTEGER", nullable: true),
                    ClientName = table.Column<string>(type: "TEXT", nullable: true),
                    ProjectDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Duration = table.Column<string>(type: "TEXT", nullable: true),
                    IsFeatured = table.Column<bool>(type: "INTEGER", nullable: true),
                    Visibility = table.Column<string>(type: "TEXT", nullable: true),
                    ProjectType = table.Column<string>(type: "TEXT", nullable: true),
                    Industry = table.Column<string>(type: "TEXT", nullable: true),
                    Skills = table.Column<string>(type: "TEXT", nullable: true),
                    Challenge = table.Column<string>(type: "TEXT", nullable: true),
                    Solution = table.Column<string>(type: "TEXT", nullable: true),
                    Result = table.Column<string>(type: "TEXT", nullable: true),
                    Testimonial = table.Column<string>(type: "TEXT", nullable: true),
                    Createdby = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    Updatedby = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PortfolioProjects", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Pricings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    BaseRate = table.Column<decimal>(type: "TEXT", nullable: false),
                    ComplexityBasic = table.Column<decimal>(type: "TEXT", nullable: false),
                    ComplexityMedium = table.Column<decimal>(type: "TEXT", nullable: false),
                    ComplexityHigh = table.Column<decimal>(type: "TEXT", nullable: false),
                    RateMotion = table.Column<decimal>(type: "TEXT", nullable: false),
                    RateExplainer = table.Column<decimal>(type: "TEXT", nullable: false),
                    RateProduction = table.Column<decimal>(type: "TEXT", nullable: false),
                    RateThreeD = table.Column<decimal>(type: "TEXT", nullable: false),
                    DeliveryDaysBasic = table.Column<int>(type: "INTEGER", nullable: false),
                    DeliveryDaysMedium = table.Column<int>(type: "INTEGER", nullable: false),
                    DeliveryDaysHigh = table.Column<int>(type: "INTEGER", nullable: false),
                    UrgentMultiplier = table.Column<decimal>(type: "TEXT", nullable: false),
                    Createdby = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    Updatedby = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pricings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Author = table.Column<string>(type: "TEXT", nullable: false),
                    Text = table.Column<string>(type: "TEXT", nullable: false),
                    Rating = table.Column<int>(type: "INTEGER", nullable: false),
                    Project = table.Column<string>(type: "TEXT", nullable: true),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    Image = table.Column<string>(type: "TEXT", nullable: true),
                    Company = table.Column<string>(type: "TEXT", nullable: true),
                    Website = table.Column<string>(type: "TEXT", nullable: true),
                    SocialLink = table.Column<string>(type: "TEXT", nullable: true),
                    IsApproved = table.Column<bool>(type: "INTEGER", nullable: false),
                    Createdby = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    Updatedby = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Text = table.Column<string>(type: "TEXT", nullable: false),
                    Icon = table.Column<string>(type: "TEXT", nullable: true),
                    VideoUrl = table.Column<string>(type: "TEXT", nullable: true),
                    DisplayOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    Price = table.Column<decimal>(type: "TEXT", nullable: false),
                    FeaturesJson = table.Column<string>(type: "TEXT", nullable: true),
                    MainTitle = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    SecondaryDescription = table.Column<string>(type: "TEXT", nullable: true),
                    GroupsJson = table.Column<string>(type: "TEXT", nullable: true),
                    ProcessJson = table.Column<string>(type: "TEXT", nullable: true),
                    Createdby = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    Updatedby = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Services", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SiteSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    HeroTitle = table.Column<string>(type: "TEXT", nullable: true),
                    HeroSubtitle = table.Column<string>(type: "TEXT", nullable: true),
                    HeroVideoUrl = table.Column<string>(type: "TEXT", nullable: true),
                    CtaText = table.Column<string>(type: "TEXT", nullable: true),
                    CtaLink = table.Column<string>(type: "TEXT", nullable: true),
                    SiteName = table.Column<string>(type: "TEXT", nullable: true),
                    LogoUrl = table.Column<string>(type: "TEXT", nullable: true),
                    SeoDescription = table.Column<string>(type: "TEXT", nullable: true),
                    SocialInstagram = table.Column<string>(type: "TEXT", nullable: true),
                    SocialBehance = table.Column<string>(type: "TEXT", nullable: true),
                    SocialDribbble = table.Column<string>(type: "TEXT", nullable: true),
                    SocialLinkedIn = table.Column<string>(type: "TEXT", nullable: true),
                    GalleryAutoplay = table.Column<bool>(type: "INTEGER", nullable: false),
                    HeroVideoOpacity = table.Column<double>(type: "REAL", nullable: false),
                    HeroTypedText = table.Column<string>(type: "TEXT", nullable: true),
                    HeroTypedColor = table.Column<string>(type: "TEXT", nullable: true),
                    TelegramLink = table.Column<string>(type: "TEXT", nullable: true),
                    AiEnabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    AiApiKey = table.Column<string>(type: "TEXT", nullable: true),
                    AiSystemPrompt = table.Column<string>(type: "TEXT", nullable: true),
                    AiWelcomeMessage = table.Column<string>(type: "TEXT", nullable: true),
                    NotifyEmailEnabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    NotifyEmailAddress = table.Column<string>(type: "TEXT", nullable: true),
                    NotifyTelegramEnabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    NotifyTelegramBotToken = table.Column<string>(type: "TEXT", nullable: true),
                    NotifyTelegramChatId = table.Column<string>(type: "TEXT", nullable: true),
                    Createdby = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    Updatedby = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SocialAccounts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Platform = table.Column<string>(type: "TEXT", nullable: false),
                    Value = table.Column<string>(type: "TEXT", nullable: false),
                    Icon = table.Column<string>(type: "TEXT", nullable: false),
                    Link = table.Column<string>(type: "TEXT", nullable: false),
                    IsVisible = table.Column<bool>(type: "INTEGER", nullable: false),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    Createdby = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    Updatedby = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SocialAccounts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TeamMembers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Role = table.Column<string>(type: "TEXT", nullable: false),
                    Image = table.Column<string>(type: "TEXT", nullable: true),
                    Bio = table.Column<string>(type: "TEXT", nullable: true),
                    Twitter = table.Column<string>(type: "TEXT", nullable: true),
                    Linkedin = table.Column<string>(type: "TEXT", nullable: true),
                    Instagram = table.Column<string>(type: "TEXT", nullable: true),
                    Skills = table.Column<string>(type: "TEXT", nullable: true),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    Createdby = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    Updatedby = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamMembers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Translations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LanguageCode = table.Column<string>(type: "TEXT", nullable: false),
                    Key = table.Column<string>(type: "TEXT", nullable: false),
                    Value = table.Column<string>(type: "TEXT", nullable: false),
                    Createdby = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    Updatedby = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Translations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VideoCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Slug = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    Description = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    ServiceType = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    Createdby = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    Updatedby = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VideoCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VisitorLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Country = table.Column<string>(type: "TEXT", nullable: true),
                    CountryCode = table.Column<string>(type: "TEXT", nullable: true),
                    City = table.Column<string>(type: "TEXT", nullable: true),
                    Region = table.Column<string>(type: "TEXT", nullable: true),
                    Page = table.Column<string>(type: "TEXT", nullable: true),
                    Section = table.Column<string>(type: "TEXT", nullable: true),
                    SessionId = table.Column<string>(type: "TEXT", nullable: true),
                    IpAddress = table.Column<string>(type: "TEXT", nullable: true),
                    VisitedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Createdby = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    Updatedby = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VisitorLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    RoleId = table.Column<string>(type: "TEXT", nullable: false),
                    ClaimType = table.Column<string>(type: "TEXT", nullable: true),
                    ClaimValue = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    ClaimType = table.Column<string>(type: "TEXT", nullable: true),
                    ClaimValue = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "TEXT", nullable: false),
                    ProviderKey = table.Column<string>(type: "TEXT", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "TEXT", nullable: true),
                    UserId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    RoleId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    LoginProvider = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Value = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ResumeEntries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Type = table.Column<string>(type: "TEXT", nullable: false),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Subtitle = table.Column<string>(type: "TEXT", nullable: false),
                    DateRange = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    TeamMemberId = table.Column<int>(type: "INTEGER", nullable: true),
                    Createdby = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    Updatedby = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResumeEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResumeEntries_TeamMembers_TeamMemberId",
                        column: x => x.TeamMemberId,
                        principalTable: "TeamMembers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Videos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    VideoUrl = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    Thumb = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    ThumbFull = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Duration = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    IsFeatured = table.Column<bool>(type: "INTEGER", nullable: false),
                    Views = table.Column<int>(type: "INTEGER", nullable: false),
                    Visibility = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    ClientName = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    ProjectDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Tags = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    CategoryId = table.Column<int>(type: "INTEGER", nullable: true),
                    Createdby = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    Updatedby = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedbyDate = table.Column<DateOnly>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Videos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Videos_VideoCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "VideoCategories",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "9a88e308-ee2f-4ece-a81e-6d60039ec2c4", "696a0335-74c3-4a55-a659-fb2c46565091", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "OtpAttempts", "OtpCode", "OtpExpiry", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "8179aa65-1499-441e-86f2-b717f57b331e", 0, "a2891015-82b6-43e9-bac0-10701b247311", "Admin@gmail.com", true, false, null, "ADMIN@GMAIL.COM", "ADMIN@GMAIL.COM", null, null, null, "AQAAAAIAAYagAAAAEDd3xTbNyUlkpsemVhPPojgX5ww/CXCVRbO2ZYYJJ45NRAcCLSl+mGWKlgT/7Fhk9Q==", null, false, "9fd6c95c-d1a5-4aa5-a64f-2567b1c34b3a", false, "Admin" });

            migrationBuilder.InsertData(
                table: "AspNetRoleClaims",
                columns: new[] { "Id", "ClaimType", "ClaimValue", "RoleId" },
                values: new object[,]
                {
                    { 1, "ListUser", "ListUser", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 2, "CreateNewUser", "CreateNewUser", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 3, "UpdateUser", "UpdateUser", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 4, "UpdatePassword", "UpdatePassword", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 5, "AssignRole", "AssignRole", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 6, "ListRole", "ListRole", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 7, "CreateNewRole", "CreateNewRole", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 8, "UpdateRole", "UpdateRole", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 9, "AssignPermissions", "AssignPermissions", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 10, "ListCompanies", "ListCompanies", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 11, "CreateCompany", "CreateCompany", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 12, "EditCompany", "EditCompany", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 13, "SearchCompany", "SearchCompany", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 14, "ViewLicences", "ViewLicences", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 15, "AddLicences", "AddLicences", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 16, "EditLicences", "EditLicences", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 17, "Licenceshistory", "Licenceshistory", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 18, "Viewlicenceshistory", "Viewlicenceshistory", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 19, "PrintJawaz", "PrintJawaz", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 20, "Listcatagories", "Listcatagories", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 21, "AddCatagory", "AddCatagory", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" },
                    { 22, "EditCatagory", "EditCatagory", "9a88e308-ee2f-4ece-a81e-6d60039ec2c4" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "9a88e308-ee2f-4ece-a81e-6d60039ec2c4", "8179aa65-1499-441e-86f2-b717f57b331e" });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ResumeEntries_TeamMemberId",
                table: "ResumeEntries",
                column: "TeamMemberId");

            migrationBuilder.CreateIndex(
                name: "IX_Videos_CategoryId",
                table: "Videos",
                column: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "ClientRequests");

            migrationBuilder.DropTable(
                name: "PortfolioProjects");

            migrationBuilder.DropTable(
                name: "Pricings");

            migrationBuilder.DropTable(
                name: "ResumeEntries");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "SiteSettings");

            migrationBuilder.DropTable(
                name: "SocialAccounts");

            migrationBuilder.DropTable(
                name: "Translations");

            migrationBuilder.DropTable(
                name: "Videos");

            migrationBuilder.DropTable(
                name: "VisitorLogs");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "TeamMembers");

            migrationBuilder.DropTable(
                name: "VideoCategories");
        }
    }
}
