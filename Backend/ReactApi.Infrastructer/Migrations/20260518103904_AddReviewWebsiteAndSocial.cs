using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApi.Infrastructer.Migrations
{
    /// <inheritdoc />
    public partial class AddReviewWebsiteAndSocial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<string>(
                name: "SocialLink",
                table: "Reviews",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Website",
                table: "Reviews",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 1,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 2,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 3,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 4,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 5,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 6,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 7,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 8,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 9,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 10,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 11,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 12,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 13,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 14,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 15,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 16,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 17,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 18,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 19,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 20,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 21,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 22,
                column: "RoleId",
                value: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b", "89c1bf4a-373a-4d6f-9d1b-dc6b180ffaab", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "1c384d16-3778-4b5c-ab8c-160f57ba893d", 0, "66f721b6-a7ce-472e-ba5e-47886937bd55", "Admin@gmail.com", true, false, null, "ADMIN@GMAIL.COM", "ADMIN@GMAIL.COM", "AQAAAAIAAYagAAAAEM6de2TvBjyN28ygb6mRHJFJFK03OLd2rZipJerGLuok1i4Bj2CX4fSV3WhdwCZoFQ==", null, false, "e075966c-344d-4308-8839-3769aab2fddd", false, "Admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b", "1c384d16-3778-4b5c-ab8c-160f57ba893d" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b", "1c384d16-3778-4b5c-ab8c-160f57ba893d" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "19f6f7c7-38b1-4d8d-be35-748acbbc6b4b");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1c384d16-3778-4b5c-ab8c-160f57ba893d");

            migrationBuilder.DropColumn(
                name: "SocialLink",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "Website",
                table: "Reviews");

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
    }
}
