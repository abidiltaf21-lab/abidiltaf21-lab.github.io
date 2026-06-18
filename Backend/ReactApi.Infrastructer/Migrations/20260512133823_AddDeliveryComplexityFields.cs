using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApi.Infrastructer.Migrations
{
    /// <inheritdoc />
    public partial class AddDeliveryComplexityFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<int>(
                name: "DeliveryDaysBasic",
                table: "Pricings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DeliveryDaysHigh",
                table: "Pricings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DeliveryDaysMedium",
                table: "Pricings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "UrgentMultiplier",
                table: "Pricings",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 1,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 2,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 3,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 4,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 5,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 6,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 7,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 8,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 9,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 10,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 11,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 12,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 13,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 14,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 15,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 16,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 17,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 18,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 19,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 20,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 21,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 22,
                column: "RoleId",
                value: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "b9d05f28-654d-49fc-9969-cecf4c2c2daf", "55d81804-4da5-424f-8c3b-c0d0ddb8c73e", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "e357fe19-9995-414a-976a-8d040a2f73dc", 0, "f70e307b-877e-4139-9457-3963d33d5135", "Admin@gmail.com", true, false, null, "ADMIN@GMAIL.COM", "ADMIN@GMAIL.COM", "AQAAAAIAAYagAAAAEOQGbN9tL15EicRmRSAGBGHzfismIWSapMn5yICmnQYQF/2w+304PxbcPZ7BmTXGSw==", null, false, "a7ecb7a1-de5e-491f-b935-a9746fe6bc8a", false, "Admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "b9d05f28-654d-49fc-9969-cecf4c2c2daf", "e357fe19-9995-414a-976a-8d040a2f73dc" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "b9d05f28-654d-49fc-9969-cecf4c2c2daf", "e357fe19-9995-414a-976a-8d040a2f73dc" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b9d05f28-654d-49fc-9969-cecf4c2c2daf");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "e357fe19-9995-414a-976a-8d040a2f73dc");

            migrationBuilder.DropColumn(
                name: "DeliveryDaysBasic",
                table: "Pricings");

            migrationBuilder.DropColumn(
                name: "DeliveryDaysHigh",
                table: "Pricings");

            migrationBuilder.DropColumn(
                name: "DeliveryDaysMedium",
                table: "Pricings");

            migrationBuilder.DropColumn(
                name: "UrgentMultiplier",
                table: "Pricings");

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
    }
}
