using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class table_v0_004 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "NotificationSetting",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "NotificationSetting",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DropColumn(
                name: "PreAmcEndDate",
                table: "ContractAssetDetail");

            migrationBuilder.RenameColumn(
                name: "PreAmcStartDate",
                table: "ContractAssetDetail",
                newName: "PreAmcCompletedDate");

            migrationBuilder.AddColumn<int>(
                name: "PreAmcCompletedBy",
                table: "ContractAssetDetail",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DocumentNumberSeries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DocumentTypeId = table.Column<int>(type: "int", nullable: false),
                    TenantOfficeId = table.Column<int>(type: "int", nullable: true),
                    Year = table.Column<string>(type: "varchar(8)", maxLength: 8, nullable: true),
                    DocumentNumber = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Separator = table.Column<string>(type: "varchar(8)", maxLength: 8, nullable: false, defaultValue: "-"),
                    EffectiveFrom = table.Column<DateTime>(type: "datetime", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime", nullable: false),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    ModifiedOn = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentNumberSeries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DocumentNumberSeries_MasterEntityData_DocumentTypeId",
                        column: x => x.DocumentTypeId,
                        principalTable: "MasterEntityData",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DocumentNumberSeries_TenantOffice_TenantOfficeId",
                        column: x => x.TenantOfficeId,
                        principalTable: "TenantOffice",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "Country",
                keyColumn: "Id",
                keyValue: 1,
                column: "CurrencySymbol",
                value: "&#8377;");

            migrationBuilder.InsertData(
                table: "MasterEntity",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "Description", "EntityType" },
                values: new object[] { 63, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Document Types", "DocumentType" });

            migrationBuilder.InsertData(
                table: "MasterEntityData",
                columns: new[] { "Id", "Code", "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "MasterEntityId", "ModifiedBy", "ModifiedOn", "Name" },
                values: new object[,]
                {
                    { 283, "DCT_CINV", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Contract Invoice" },
                    { 284, "DCT_RCPT", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Receipt" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_DocumentNumberSeries_DocumentTypeId",
                table: "DocumentNumberSeries",
                column: "DocumentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentNumberSeries_TenantOfficeId",
                table: "DocumentNumberSeries",
                column: "TenantOfficeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DocumentNumberSeries");

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 283);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 284);

            migrationBuilder.DeleteData(
                table: "MasterEntity",
                keyColumn: "Id",
                keyValue: 63);

            migrationBuilder.DropColumn(
                name: "PreAmcCompletedBy",
                table: "ContractAssetDetail");

            migrationBuilder.RenameColumn(
                name: "PreAmcCompletedDate",
                table: "ContractAssetDetail",
                newName: "PreAmcStartDate");

            migrationBuilder.AddColumn<DateTime>(
                name: "PreAmcEndDate",
                table: "ContractAssetDetail",
                type: "date",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Country",
                keyColumn: "Id",
                keyValue: 1,
                column: "CurrencySymbol",
                value: "₹");

            migrationBuilder.InsertData(
                table: "NotificationSetting",
                columns: new[] { "Id", "BusinessEventId", "Email", "RoleId" },
                values: new object[,]
                {
                    { 1, 1, true, 3 },
                    { 2, 2, true, 24 }
                });
        }
    }
}
