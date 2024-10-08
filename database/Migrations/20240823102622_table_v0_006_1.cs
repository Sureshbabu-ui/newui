using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class table_v0_006_1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "GstNumber",
                table: "VendorInfo",
                type: "varchar(16)",
                maxLength: 16,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16);

            migrationBuilder.CreateIndex(
                name: "IX_TenantRegion_Code",
                table: "TenantRegion",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TenantRegion_RegionName",
                table: "TenantRegion",
                column: "RegionName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TenantRegion_Code",
                table: "TenantRegion");

            migrationBuilder.DropIndex(
                name: "IX_TenantRegion_RegionName",
                table: "TenantRegion");

            migrationBuilder.AlterColumn<string>(
                name: "GstNumber",
                table: "VendorInfo",
                type: "varchar(16)",
                maxLength: 16,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16,
                oldNullable: true);
        }
    }
}
