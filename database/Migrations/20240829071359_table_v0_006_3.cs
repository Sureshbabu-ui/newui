using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class table_v0_006_3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
          table: "TenantOffice",
          keyColumn: "Id",
          keyValue: 42,
          column: "Code",
          value: "HOC");

            migrationBuilder.CreateIndex(
                name: "IX_TenantOffice_Code",
                table: "TenantOffice",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TenantOffice_OfficeName",
                table: "TenantOffice",
                column: "OfficeName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TenantOffice_Code",
                table: "TenantOffice");

            migrationBuilder.DropIndex(
                name: "IX_TenantOffice_OfficeName",
                table: "TenantOffice");
        }
    }
}
