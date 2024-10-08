using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class table_0_31_alpha_6_1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "BusinessModule",
                columns: new[] { "Id", "BusinessModuleName", "CreatedBy", "CreatedOn", "Description", "IsActive", "UpdatedBy", "UpdatedOn" },
                values: new object[] { 18, "Purchase Order", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Manages the creation and listing of specific purchaseorder and its details", true, null, null });

            migrationBuilder.InsertData(
                table: "BusinessFunction",
                columns: new[] { "Id", "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId", "CreatedBy", "CreatedOn", "Description", "IsActive", "UpdatedBy", "UpdatedOn" },
                values: new object[] { 109, "PURCHASEORDER_VIEW", "Purchase Order List", 18, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 109);

            migrationBuilder.DeleteData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 18);
        }
    }
}
