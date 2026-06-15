using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApi.Infrastructer.Migrations
{
    /// <inheritdoc />
    public partial class asdf : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8", "9b2afe95-6302-4342-ad00-a414dd5dc419" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "9b2afe95-6302-4342-ad00-a414dd5dc419");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 1,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 2,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 3,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 4,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 5,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 6,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 7,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 8,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 9,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 10,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 11,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 12,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 13,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 14,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 15,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 16,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 17,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 18,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 19,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 20,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 21,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 22,
                column: "RoleId",
                value: "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8", null, "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "9b2afe95-6302-4342-ad00-a414dd5dc419", 0, "898ec9d7-17e0-4860-a8dd-221f8dbe21af", "Admin@gmail.com", true, false, null, "ADMIN@GMAIL.COM", "ADMIN@GMAIL.COM", "AQAAAAIAAYagAAAAEJYZ5ygQeRzDG9m+HgPn8YiSBVZmLpgqX5Zd12aYp67CZZNMXzQl7djVUJBlo1KWuQ==", null, false, "eaba1cd1-b9b0-49a5-96c4-e871d2d13659", false, "Admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "09c8f26b-6f80-4071-8ce5-b6ebb0aed5d8", "9b2afe95-6302-4342-ad00-a414dd5dc419" });
        }
    }
}
