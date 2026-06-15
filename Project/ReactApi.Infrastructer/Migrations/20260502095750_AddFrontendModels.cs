using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApi.Infrastructer.Migrations
{
    /// <inheritdoc />
    public partial class AddFrontendModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "5b8df147-d4fa-4284-9025-f83e99391ab0", "ef53f7f8-ae03-4b28-b6b9-c8ef24ab1dae" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "ef53f7f8-ae03-4b28-b6b9-c8ef24ab1dae");

            migrationBuilder.CreateTable(
                name: "ClientRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BudgetRange = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InternalNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Createdby = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedbyDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Updatedby = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedbyDate = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientRequests", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PortfolioProjects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VideoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Thumb = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThumbFull = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tags = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Views = table.Column<int>(type: "int", nullable: true),
                    ClientName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Duration = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsFeatured = table.Column<bool>(type: "bit", nullable: true),
                    Visibility = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Createdby = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedbyDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Updatedby = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedbyDate = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PortfolioProjects", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SiteSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HeroTitle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HeroSubtitle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HeroVideoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CtaText = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CtaLink = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SiteName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LogoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SeoDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SocialInstagram = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SocialBehance = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SocialDribbble = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SocialLinkedIn = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Createdby = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedbyDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Updatedby = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedbyDate = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteSettings", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 1,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 2,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 3,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 4,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 5,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 6,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 7,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 8,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 9,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 10,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 11,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 12,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 13,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 14,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 15,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 16,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 17,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 18,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 19,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 20,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 21,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 22,
                column: "RoleId",
                value: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "5d7f49aa-de19-4b07-9fc0-6be07c56163d", "d727c9ac-042b-411f-8c9a-954fd9c237fd", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "b70a9c75-e14f-4180-8edb-8250ed8c8f8e", 0, "43f63b31-c198-4b83-82c4-fdde2a059352", "Admin@gmail.com", true, false, null, "ADMIN@GMAIL.COM", "ADMIN@GMAIL.COM", "AQAAAAIAAYagAAAAEB8QGw7QkaNCFGLogkDRfB8/0edzqYCmOAcFYoFmfvHX5fZStcwiO1I5xayDednEeg==", null, false, "a1e4c7b3-381e-4873-89bf-1470b34af7fc", false, "Admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "5d7f49aa-de19-4b07-9fc0-6be07c56163d", "b70a9c75-e14f-4180-8edb-8250ed8c8f8e" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClientRequests");

            migrationBuilder.DropTable(
                name: "PortfolioProjects");

            migrationBuilder.DropTable(
                name: "SiteSettings");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "5d7f49aa-de19-4b07-9fc0-6be07c56163d", "b70a9c75-e14f-4180-8edb-8250ed8c8f8e" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5d7f49aa-de19-4b07-9fc0-6be07c56163d");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b70a9c75-e14f-4180-8edb-8250ed8c8f8e");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 1,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 2,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 3,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 4,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 5,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 6,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 7,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 8,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 9,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 10,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 11,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 12,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 13,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 14,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 15,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 16,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 17,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 18,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 19,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 20,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 21,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 22,
                column: "RoleId",
                value: "5b8df147-d4fa-4284-9025-f83e99391ab0");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "5b8df147-d4fa-4284-9025-f83e99391ab0", "63c616cc-81d6-4c7a-8df5-f1ad60d02fbc", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "ef53f7f8-ae03-4b28-b6b9-c8ef24ab1dae", 0, "7af14d70-6d34-4bde-9d82-329375608a57", "Admin@gmail.com", true, false, null, "ADMIN@GMAIL.COM", "ADMIN@GMAIL.COM", "AQAAAAIAAYagAAAAEBDV5BHvBkLL0j3PBecrDPfIUbU6ogVX2JW+GfPzQ9b7nRdbwyFaMLCQmonfZ8rO5w==", null, false, "4b8f5ad8-bce5-4ff1-b6b4-769fb86e11d3", false, "Admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "5b8df147-d4fa-4284-9025-f83e99391ab0", "ef53f7f8-ae03-4b28-b6b9-c8ef24ab1dae" });
        }
    }
}
