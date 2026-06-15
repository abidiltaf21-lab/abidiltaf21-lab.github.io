using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApi.Infrastructer.Migrations
{
    public partial class AddTelegramToClientRequests : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Telegram",
                table: "ClientRequests",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Telegram", table: "ClientRequests");
        }
    }
}
