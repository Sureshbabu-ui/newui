using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class table_v0_003_2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "MasterEntity",
                keyColumn: "Id",
                keyValue: 48,
                column: "Description",
                value: "Travel Mode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "MasterEntity",
                keyColumn: "Id",
                keyValue: 48,
                column: "Description",
                value: "Travel Mode ");
        }
    }
}
