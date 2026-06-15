using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApi.Infrastructer.Migrations
{
    /// <inheritdoc />
    public partial class AddHeroVideoOpacity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "738f3af5-10cb-4a46-96c0-a96759902d4a", "9b16fece-12e4-4522-a0a6-98dd1938e21e" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "9b16fece-12e4-4522-a0a6-98dd1938e21e");

            migrationBuilder.AddColumn<double>(
                name: "HeroVideoOpacity",
                table: "SiteSettings",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 1,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 2,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 3,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 4,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 5,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 6,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 7,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 8,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 9,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 10,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 11,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 12,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 13,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 14,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 15,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 16,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 17,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 18,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 19,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 20,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 21,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 22,
                column: "RoleId",
                value: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "27ef2cfc-f9f4-40ee-a7f9-82b840d56540", "0b0b12b0-1445-4d46-a550-7a57ac344ed4", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "f045db72-6573-496b-90bd-7605c3221d72", 0, "5daf34d0-087b-42f0-bfa3-b469e7e379ef", "Admin@gmail.com", true, false, null, "ADMIN@GMAIL.COM", "ADMIN@GMAIL.COM", "AQAAAAIAAYagAAAAEErFkfKkKGsQ6Y8sE3nWOjl8NU+zfIRvJrp568fJSxDvDNzLVR/Ub6yeNpX7VusEhg==", null, false, "899a2ea5-c0a1-43cf-8636-0a9e69a8a092", false, "Admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "27ef2cfc-f9f4-40ee-a7f9-82b840d56540", "f045db72-6573-496b-90bd-7605c3221d72" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "27ef2cfc-f9f4-40ee-a7f9-82b840d56540", "f045db72-6573-496b-90bd-7605c3221d72" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "27ef2cfc-f9f4-40ee-a7f9-82b840d56540");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "f045db72-6573-496b-90bd-7605c3221d72");

            migrationBuilder.DropColumn(
                name: "HeroVideoOpacity",
                table: "SiteSettings");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 1,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 2,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 3,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 4,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 5,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 6,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 7,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 8,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 9,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 10,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 11,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 12,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 13,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 14,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 15,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 16,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 17,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 18,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 19,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 20,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 21,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 22,
                column: "RoleId",
                value: "738f3af5-10cb-4a46-96c0-a96759902d4a");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "738f3af5-10cb-4a46-96c0-a96759902d4a", "050a74ac-2c9f-440f-8886-4991090deb01", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "9b16fece-12e4-4522-a0a6-98dd1938e21e", 0, "fdf77485-ccd6-4cca-89bb-574628d90313", "Admin@gmail.com", true, false, null, "ADMIN@GMAIL.COM", "ADMIN@GMAIL.COM", "AQAAAAIAAYagAAAAEMRXTAkvq2JLBA7XAkLmhr6THArA+F7fKLVzwG21I3EoIpoFkqRgb/qVzyWUIeYhbA==", null, false, "dbe516e4-e828-4792-8d80-0b5315dee528", false, "Admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "738f3af5-10cb-4a46-96c0-a96759902d4a", "9b16fece-12e4-4522-a0a6-98dd1938e21e" });
        }
    }
}
