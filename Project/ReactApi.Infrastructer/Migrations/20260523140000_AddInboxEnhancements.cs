using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApi.Infrastructer.Migrations
{
    public partial class AddInboxEnhancements : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRead",
                table: "ClientRequests",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "ClientRequests",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "IsRead", table: "ClientRequests");
            migrationBuilder.DropColumn(name: "Phone", table: "ClientRequests");
        }
    }
}
