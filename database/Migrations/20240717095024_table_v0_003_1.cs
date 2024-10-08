using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class table_v0_003_1 : Migration
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

            migrationBuilder.UpdateData(
                table: "MasterEntity",
                keyColumn: "Id",
                keyValue: 51,
                column: "Description",
                value: "Purchase Order Payment Terms");

            migrationBuilder.UpdateData(
                table: "MasterEntity",
                keyColumn: "Id",
                keyValue: 52,
                column: "Description",
                value: "Purchase Order Shipment Modes");

            migrationBuilder.UpdateData(
                table: "MasterEntity",
                keyColumn: "Id",
                keyValue: 53,
                column: "Description",
                value: "Purchase Order Payment Modes");

            migrationBuilder.UpdateData(
                table: "MasterEntity",
                keyColumn: "Id",
                keyValue: 54,
                column: "Description",
                value: "Purchase Order Part Delivery Term");

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 218,
                column: "Name",
                value: "By Train");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "MasterEntity",
                keyColumn: "Id",
                keyValue: 48,
                column: "Description",
                value: "Travel Mode");

            migrationBuilder.UpdateData(
                table: "MasterEntity",
                keyColumn: "Id",
                keyValue: 51,
                column: "Description",
                value: "Puchase Order Payment Terms");

            migrationBuilder.UpdateData(
                table: "MasterEntity",
                keyColumn: "Id",
                keyValue: 52,
                column: "Description",
                value: "Puchase Order Shipment Modes");

            migrationBuilder.UpdateData(
                table: "MasterEntity",
                keyColumn: "Id",
                keyValue: 53,
                column: "Description",
                value: "Puchase Order Payment Modes");

            migrationBuilder.UpdateData(
                table: "MasterEntity",
                keyColumn: "Id",
                keyValue: 54,
                column: "Description",
                value: "Puchase Order Part Delivery Term");

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 218,
                column: "Name",
                value: "By Tran");
        }
    }
}
