using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApi.Infrastructer.Migrations
{
    /// <inheritdoc />
    public partial class UnifiedModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.CreateTable(
                name: "Pricings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BaseRate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ComplexityBasic = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ComplexityMedium = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ComplexityHigh = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RateMotion = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RateExplainer = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RateProduction = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RateThreeD = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Createdby = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedbyDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Updatedby = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedbyDate = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pricings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Author = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Project = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Createdby = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedbyDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Updatedby = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedbyDate = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TeamMembers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Bio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Twitter = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Linkedin = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Instagram = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Createdby = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedbyDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Updatedby = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedbyDate = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamMembers", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 1,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 2,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 3,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 4,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 5,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 6,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 7,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 8,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 9,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 10,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 11,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 12,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 13,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 14,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 15,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 16,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 17,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 18,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 19,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 20,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 21,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 22,
                column: "RoleId",
                value: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0", "86e7264c-3279-4a7e-bdb8-e3d729ccaddd", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "e02f52d4-8e6f-43a3-b180-3108eed1abb5", 0, "eef69889-3574-40c4-a0c0-5b6df39688f9", "Admin@gmail.com", true, false, null, "ADMIN@GMAIL.COM", "ADMIN@GMAIL.COM", "AQAAAAIAAYagAAAAEA9r5R/COq/tilxzGEoodqh9CJuh9qIMdWaIVEnKhb0KWtZM8HbTf8d9+sYrDzijIg==", null, false, "e17b8ace-a205-4ca7-999a-0e3955fd1877", false, "Admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0", "e02f52d4-8e6f-43a3-b180-3108eed1abb5" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Pricings");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "TeamMembers");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0", "e02f52d4-8e6f-43a3-b180-3108eed1abb5" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "79d8460c-1916-46c2-9ccb-e63d1e3ee1c0");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "e02f52d4-8e6f-43a3-b180-3108eed1abb5");

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
    }
}
