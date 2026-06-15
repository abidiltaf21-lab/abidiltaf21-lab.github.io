using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApi.Infrastructer.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectOverviewFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "e036d71e-94b1-4865-8cbd-ed78304841c2", "03b2da2e-4dec-47f4-b449-5556994ee5dc" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "03b2da2e-4dec-47f4-b449-5556994ee5dc");

            migrationBuilder.AddColumn<string>(
                name: "Challenge",
                table: "PortfolioProjects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Industry",
                table: "PortfolioProjects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectType",
                table: "PortfolioProjects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Result",
                table: "PortfolioProjects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Skills",
                table: "PortfolioProjects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Solution",
                table: "PortfolioProjects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Testimonial",
                table: "PortfolioProjects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 1,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 2,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 3,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 4,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 5,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 6,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 7,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 8,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 9,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 10,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 11,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 12,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 13,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 14,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 15,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 16,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 17,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 18,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 19,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 20,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 21,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 22,
                column: "RoleId",
                value: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "08eeb39a-faf1-4b33-a7fe-c2cd67b46513", "8752aa66-1aa4-4159-a3ce-38a1909bd456", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "cb322755-44fd-480d-bb0d-096982ee0dc5", 0, "bdd05ce9-1193-4d65-93d5-6726edd18641", "Admin@gmail.com", true, false, null, "ADMIN@GMAIL.COM", "ADMIN@GMAIL.COM", "AQAAAAIAAYagAAAAEK8qFRGyWRIIEQ+2spaQ0ob98MS653hhCdNWmj+F6vz5EmoRKtaDyHIeP75h6tZSxA==", null, false, "affe58a6-c44a-424a-8291-f4478f0077c2", false, "Admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "08eeb39a-faf1-4b33-a7fe-c2cd67b46513", "cb322755-44fd-480d-bb0d-096982ee0dc5" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "08eeb39a-faf1-4b33-a7fe-c2cd67b46513", "cb322755-44fd-480d-bb0d-096982ee0dc5" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "08eeb39a-faf1-4b33-a7fe-c2cd67b46513");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "cb322755-44fd-480d-bb0d-096982ee0dc5");

            migrationBuilder.DropColumn(
                name: "Challenge",
                table: "PortfolioProjects");

            migrationBuilder.DropColumn(
                name: "Industry",
                table: "PortfolioProjects");

            migrationBuilder.DropColumn(
                name: "ProjectType",
                table: "PortfolioProjects");

            migrationBuilder.DropColumn(
                name: "Result",
                table: "PortfolioProjects");

            migrationBuilder.DropColumn(
                name: "Skills",
                table: "PortfolioProjects");

            migrationBuilder.DropColumn(
                name: "Solution",
                table: "PortfolioProjects");

            migrationBuilder.DropColumn(
                name: "Testimonial",
                table: "PortfolioProjects");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 1,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 2,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 3,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 4,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 5,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 6,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 7,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 8,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 9,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 10,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 11,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 12,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 13,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 14,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 15,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 16,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 17,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 18,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 19,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 20,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 21,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 22,
                column: "RoleId",
                value: "e036d71e-94b1-4865-8cbd-ed78304841c2");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "e036d71e-94b1-4865-8cbd-ed78304841c2", "66c87084-f5ba-4fae-b505-ace487ead08d", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "03b2da2e-4dec-47f4-b449-5556994ee5dc", 0, "3bdcc4d0-8b76-408d-a47d-f8c0e2508d6b", "Admin@gmail.com", true, false, null, "ADMIN@GMAIL.COM", "ADMIN@GMAIL.COM", "AQAAAAIAAYagAAAAEJlIiIyKsG8qyWrACi0qEmSN4y4eEhvTjKwGDoHu18O1L1vB8WUE7LeRXhdgM8GXtQ==", null, false, "fe87663f-89af-4e69-9b1e-56b6ed15edb4", false, "Admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "e036d71e-94b1-4865-8cbd-ed78304841c2", "03b2da2e-4dec-47f4-b449-5556994ee5dc" });
        }
    }
}
