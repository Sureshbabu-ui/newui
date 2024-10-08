using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class table_v0_006 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContractAssetPmDetail_Vendor_PmVendorId",
                table: "ContractAssetPmDetail");

            migrationBuilder.RenameColumn(
                name: "PmVendorId",
                table: "ContractAssetPmDetail",
                newName: "VendorBranchId");

            migrationBuilder.RenameIndex(
                name: "IX_ContractAssetPmDetail_PmVendorId",
                table: "ContractAssetPmDetail",
                newName: "IX_ContractAssetPmDetail_VendorBranchId");

            migrationBuilder.AlterColumn<string>(
                name: "EmployeeCode",
                table: "UserInfo",
                type: "varchar(32)",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(8)",
                oldMaxLength: 8);

            migrationBuilder.AlterColumn<int>(
                name: "RegionId",
                table: "TenantOffice",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<DateTime>(
                name: "PmScheduledDate",
                table: "ContractAssetPmDetail",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime");

            migrationBuilder.AlterColumn<DateTime>(
                name: "PmDate",
                table: "ContractAssetPmDetail",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CustomerSiteId",
                table: "ContractAssetPmDetail",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "PmScheduleId",
                table: "ContractAssetPmDetail",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PreAmcVendorBranchId",
                table: "ContractAssetDetail",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ContractPmSchedule",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ContractId = table.Column<int>(type: "int", nullable: false),
                    PmScheduleNumber = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: false),
                    PmDueDate = table.Column<DateTime>(type: "date", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractPmSchedule", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContractPmSchedule_Contract_ContractId",
                        column: x => x.ContractId,
                        principalTable: "Contract",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "BusinessFunction",
                columns: new[] { "Id", "BusinessFunctionCode", "BusinessFunctionName", "BusinessFunctionTypeId", "BusinessModuleId", "CreatedBy", "CreatedOn", "Description", "IsActive", "UpdatedBy", "UpdatedOn" },
                values: new object[,]
                {
                    { 126, "GSTRATE_VIEW", "GST rate view", 275, 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 127, "GSTRATE_MANAGE", "GST rate manage", 275, 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContractAssetPmDetail_PmScheduleId",
                table: "ContractAssetPmDetail",
                column: "PmScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractAssetDetail_PreAmcVendorBranchId",
                table: "ContractAssetDetail",
                column: "PreAmcVendorBranchId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractPmSchedule_ContractId",
                table: "ContractPmSchedule",
                column: "ContractId");

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAssetDetail_VendorBranch_PreAmcVendorBranchId",
                table: "ContractAssetDetail",
                column: "PreAmcVendorBranchId",
                principalTable: "VendorBranch",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAssetPmDetail_ContractPmSchedule_PmScheduleId",
                table: "ContractAssetPmDetail",
                column: "PmScheduleId",
                principalTable: "ContractPmSchedule",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAssetPmDetail_VendorBranch_VendorBranchId",
                table: "ContractAssetPmDetail",
                column: "VendorBranchId",
                principalTable: "VendorBranch",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContractAssetDetail_VendorBranch_PreAmcVendorBranchId",
                table: "ContractAssetDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractAssetPmDetail_ContractPmSchedule_PmScheduleId",
                table: "ContractAssetPmDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractAssetPmDetail_VendorBranch_VendorBranchId",
                table: "ContractAssetPmDetail");

            migrationBuilder.DropTable(
                name: "ContractPmSchedule");

            migrationBuilder.DropIndex(
                name: "IX_ContractAssetPmDetail_PmScheduleId",
                table: "ContractAssetPmDetail");

            migrationBuilder.DropIndex(
                name: "IX_ContractAssetDetail_PreAmcVendorBranchId",
                table: "ContractAssetDetail");

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 126);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 127);

            migrationBuilder.DropColumn(
                name: "PmScheduleId",
                table: "ContractAssetPmDetail");

            migrationBuilder.DropColumn(
                name: "PreAmcVendorBranchId",
                table: "ContractAssetDetail");

            migrationBuilder.RenameColumn(
                name: "VendorBranchId",
                table: "ContractAssetPmDetail",
                newName: "PmVendorId");

            migrationBuilder.RenameIndex(
                name: "IX_ContractAssetPmDetail_VendorBranchId",
                table: "ContractAssetPmDetail",
                newName: "IX_ContractAssetPmDetail_PmVendorId");

            migrationBuilder.AlterColumn<string>(
                name: "EmployeeCode",
                table: "UserInfo",
                type: "varchar(8)",
                maxLength: 8,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(32)",
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<int>(
                name: "RegionId",
                table: "TenantOffice",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "PmScheduledDate",
                table: "ContractAssetPmDetail",
                type: "datetime",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "date");

            migrationBuilder.AlterColumn<DateTime>(
                name: "PmDate",
                table: "ContractAssetPmDetail",
                type: "datetime",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CustomerSiteId",
                table: "ContractAssetPmDetail",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAssetPmDetail_Vendor_PmVendorId",
                table: "ContractAssetPmDetail",
                column: "PmVendorId",
                principalTable: "Vendor",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
