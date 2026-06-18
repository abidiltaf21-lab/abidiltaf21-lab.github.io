using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApi.Infrastructer.Migrations
{
    /// <inheritdoc />
    public partial class AddHeroTypedFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<string>(
                name: "HeroTypedColor",
                table: "SiteSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HeroTypedText",
                table: "SiteSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 1,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 2,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 3,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 4,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 5,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 6,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 7,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 8,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 9,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 10,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 11,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 12,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 13,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 14,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 15,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 16,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 17,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 18,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 19,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 20,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 21,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 22,
                column: "RoleId",
                value: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "38009ae0-6504-4cf5-91ff-0ee3646cf868", "ef092599-0550-44c0-9ac2-317f9b5436b3", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "edd962b0-b029-444a-9e6a-ce2ec337dcdf", 0, "8d450f59-5231-4363-ac5e-473552ff2053", "Admin@gmail.com", true, false, null, "ADMIN@GMAIL.COM", "ADMIN@GMAIL.COM", "AQAAAAIAAYagAAAAENBaYFf8YFDg88Wvm79iQfnV/Y6jqFnUK5a0SRj9XORV0FBMGHnVh4uVm4dLX9AN/w==", null, false, "d264a9d1-40c0-4c49-9f3f-ed67337ccb48", false, "Admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "38009ae0-6504-4cf5-91ff-0ee3646cf868", "edd962b0-b029-444a-9e6a-ce2ec337dcdf" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "38009ae0-6504-4cf5-91ff-0ee3646cf868", "edd962b0-b029-444a-9e6a-ce2ec337dcdf" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "38009ae0-6504-4cf5-91ff-0ee3646cf868");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "edd962b0-b029-444a-9e6a-ce2ec337dcdf");

            migrationBuilder.DropColumn(
                name: "HeroTypedColor",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "HeroTypedText",
                table: "SiteSettings");

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
    }
}
