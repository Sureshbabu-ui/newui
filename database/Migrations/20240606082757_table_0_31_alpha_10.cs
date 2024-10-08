using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class table_0_31_alpha_10 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "ShipToTenantOfficeInfoId",
                table: "PurchaseOrder",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "CustomerSiteId",
                table: "PurchaseOrder",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ShipToCustomerSiteId",
                table: "PurchaseOrder",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ChequeRealizedOn",
                table: "BankCollection",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ChequeReturnedOn",
                table: "BankCollection",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ChequeReturnedReason",
                table: "BankCollection",
                type: "varchar(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustomerBankName",
                table: "BankCollection",
                type: "varchar(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.InsertData(
                table: "MasterEntityData",
                columns: new[] { "Id", "Code", "CreatedBy", "CreatedOn", "IsActive", "MasterEntityId", "ModifiedBy", "ModifiedOn", "Name" },
                values: new object[] { 247, "PYM_CHEQ", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 37, null, null, "CHEQUE" });

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrder_CustomerSiteId",
                table: "PurchaseOrder",
                column: "CustomerSiteId");

            migrationBuilder.CreateIndex(
                name: "IX_BankCollection_TenantBankAccountId",
                table: "BankCollection",
                column: "TenantBankAccountId");

            migrationBuilder.AddForeignKey(
                name: "FK_BankCollection_TenantBankAccount_TenantBankAccountId",
                table: "BankCollection",
                column: "TenantBankAccountId",
                principalTable: "TenantBankAccount",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PurchaseOrder_CustomerSite_CustomerSiteId",
                table: "PurchaseOrder",
                column: "CustomerSiteId",
                principalTable: "CustomerSite",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BankCollection_TenantBankAccount_TenantBankAccountId",
                table: "BankCollection");

            migrationBuilder.DropForeignKey(
                name: "FK_PurchaseOrder_CustomerSite_CustomerSiteId",
                table: "PurchaseOrder");

            migrationBuilder.DropIndex(
                name: "IX_PurchaseOrder_CustomerSiteId",
                table: "PurchaseOrder");

            migrationBuilder.DropIndex(
                name: "IX_BankCollection_TenantBankAccountId",
                table: "BankCollection");

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 247);

            migrationBuilder.DropColumn(
                name: "CustomerSiteId",
                table: "PurchaseOrder");

            migrationBuilder.DropColumn(
                name: "ShipToCustomerSiteId",
                table: "PurchaseOrder");

            migrationBuilder.DropColumn(
                name: "ChequeRealizedOn",
                table: "BankCollection");

            migrationBuilder.DropColumn(
                name: "ChequeReturnedOn",
                table: "BankCollection");

            migrationBuilder.DropColumn(
                name: "ChequeReturnedReason",
                table: "BankCollection");

            migrationBuilder.DropColumn(
                name: "CustomerBankName",
                table: "BankCollection");

            migrationBuilder.AlterColumn<int>(
                name: "ShipToTenantOfficeInfoId",
                table: "PurchaseOrder",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
