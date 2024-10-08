using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class table_0_31_alpha_8 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContractAssetDetail_AssetProductCategory_AssetProductCategoryId",
                table: "ContractAssetDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractAssetDetail_CustomerSite_CustomerSiteId",
                table: "ContractAssetDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractAssetDetail_Make_ProductMakeId",
                table: "ContractAssetDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractAssetDetail_Product_ProductModelId",
                table: "ContractAssetDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractAssetDetail_TenantOffice_TenantOfficeId",
                table: "ContractAssetDetail");

            migrationBuilder.DropIndex(
                name: "IX_ContractAssetDetail_AssetProductCategoryId",
                table: "ContractAssetDetail");

            migrationBuilder.DropIndex(
                name: "IX_ContractAssetDetail_CustomerSiteId",
                table: "ContractAssetDetail");

            migrationBuilder.DropIndex(
                name: "IX_ContractAssetDetail_ProductMakeId",
                table: "ContractAssetDetail");

            migrationBuilder.DropIndex(
                name: "IX_ContractAssetDetail_ProductModelId",
                table: "ContractAssetDetail");

            migrationBuilder.DropIndex(
             name: "IX_ContractAssetDetail_TenantOfficeId",
             table: "ContractAssetDetail");

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 211);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 212);

            migrationBuilder.DeleteData(
                table: "MasterEntity",
                keyColumn: "Id",
                keyValue: 50);

            migrationBuilder.DropColumn(
                name: "AssetProductCategoryId",
                table: "ContractAssetDetail");

            migrationBuilder.DropColumn(
                name: "CustomerAssetId",
                table: "ContractAssetDetail");

            migrationBuilder.DropColumn(
                name: "CustomerSiteId",
                table: "ContractAssetDetail");

            migrationBuilder.DropColumn(
                name: "MspAssetId",
                table: "ContractAssetDetail");

            migrationBuilder.DropColumn(
                name: "ProductMakeId",
                table: "ContractAssetDetail");

            migrationBuilder.DropColumn(
                name: "ProductModelId",
                table: "ContractAssetDetail");

            migrationBuilder.DropColumn(
                name: "ProductSerialNumber",
                table: "ContractAssetDetail");

            migrationBuilder.DropColumn(
                name: "WarrantyEndDate",
                table: "ContractAssetDetail");

            migrationBuilder.DropColumn(
                name: "TenantOfficeId",
                table: "ContractAssetDetail");

            migrationBuilder.AddColumn<int>(
          name: "AssetId",
          table: "ContractAssetDetail",
          type: "int",
          nullable: true,
          defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsSlaBreached",
                table: "ServiceRequest",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SlaBreachedReason",
                table: "ServiceRequest",
                type: "varchar(2048)",
                maxLength: 2048,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PartName",
                table: "PurchaseOrderDetail",
                type: "varchar(128)",
                maxLength: 128,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(64)",
                oldMaxLength: 64,
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WarrantyPeriod",
                table: "PartIndentDemand",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsRenewedAsset",
                table: "ContractAssetDetail",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Asset",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MspAssetId = table.Column<string>(type: "varchar(16)", maxLength: 16, nullable: true),
                    CustomerAssetId = table.Column<string>(type: "varchar(16)", maxLength: 16, nullable: true),
                    AssetProductCategoryId = table.Column<int>(type: "int", nullable: false),
                    ProductMakeId = table.Column<int>(type: "int", nullable: false),
                    ProductModelId = table.Column<int>(type: "int", nullable: false),
                    ProductSerialNumber = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: true),
                    WarrantyEndDate = table.Column<DateTime>(type: "date", nullable: true),
                    TenantOfficeId = table.Column<int>(type: "int", nullable: false),
                    CustomerSiteId = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime", nullable: false),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    ModifiedOn = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Asset", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Asset_AssetProductCategory_AssetProductCategoryId",
                        column: x => x.AssetProductCategoryId,
                        principalTable: "AssetProductCategory",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Asset_CustomerSite_CustomerSiteId",
                        column: x => x.CustomerSiteId,
                        principalTable: "CustomerSite",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Asset_Make_ProductMakeId",
                        column: x => x.ProductMakeId,
                        principalTable: "Make",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Asset_Product_ProductModelId",
                        column: x => x.ProductModelId,
                        principalTable: "Product",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Asset_TenantOffice_TenantOfficeId",
                        column: x => x.TenantOfficeId,
                        principalTable: "TenantOffice",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "AppSetting",
                columns: new[] { "Id", "AppKey", "AppValue", "CreatedBy", "CreatedOn", "UpdatedBy", "UpdatedOn" },
                values: new object[] { 25, "LastPartCategoryCode", "87", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null });

            migrationBuilder.InsertData(
                table: "BusinessFunction",
                columns: new[] { "Id", "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId", "CreatedBy", "CreatedOn", "Description", "IsActive", "UpdatedBy", "UpdatedOn" },
                values: new object[] { 112, "IMPRESTPURCHASEORDER_MANAGE", "Bulk Purchase Order Manage", 18, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null });

            //migrationBuilder.CreateIndex(
            //    name: "IX_Asset_AssetProductCategoryId",
            //    table: "Asset",
            //    column: "AssetProductCategoryId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Asset_CustomerSiteId",
            //    table: "Asset",
            //    column: "CustomerSiteId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Asset_ProductMakeId",
            //    table: "Asset",
            //    column: "ProductMakeId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Asset_ProductModelId",
            //    table: "Asset",
            //    column: "ProductModelId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Asset_TenantOfficeId",
            //    table: "Asset",
            //    column: "TenantOfficeId");

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAssetDetail_Asset_AssetId",
                table: "ContractAssetDetail",
                column: "AssetId",
                principalTable: "Asset",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContractAssetDetail_Asset_AssetId",
                table: "ContractAssetDetail");

            migrationBuilder.DropTable(
                name: "Asset");

            migrationBuilder.DeleteData(
                table: "AppSetting",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 112);

            migrationBuilder.DropColumn(
                name: "IsSlaBreached",
                table: "ServiceRequest");

            migrationBuilder.DropColumn(
                name: "SlaBreachedReason",
                table: "ServiceRequest");

            migrationBuilder.DropColumn(
                name: "WarrantyPeriod",
                table: "PartIndentDemand");

            migrationBuilder.DropColumn(
                name: "IsRenewedAsset",
                table: "ContractAssetDetail");

            migrationBuilder.RenameColumn(
                name: "AssetId",
                table: "ContractAssetDetail",
                newName: "TenantOfficeId");

            migrationBuilder.RenameIndex(
                name: "IX_ContractAssetDetail_AssetId",
                table: "ContractAssetDetail",
                newName: "IX_ContractAssetDetail_TenantOfficeId");

            migrationBuilder.AlterColumn<string>(
                name: "PartName",
                table: "PurchaseOrderDetail",
                type: "varchar(64)",
                maxLength: 64,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(128)",
                oldMaxLength: 128,
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AssetProductCategoryId",
                table: "ContractAssetDetail",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CustomerAssetId",
                table: "ContractAssetDetail",
                type: "varchar(16)",
                maxLength: 16,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CustomerSiteId",
                table: "ContractAssetDetail",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "MspAssetId",
                table: "ContractAssetDetail",
                type: "varchar(16)",
                maxLength: 16,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProductMakeId",
                table: "ContractAssetDetail",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProductModelId",
                table: "ContractAssetDetail",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ProductSerialNumber",
                table: "ContractAssetDetail",
                type: "varchar(32)",
                maxLength: 32,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "WarrantyEndDate",
                table: "ContractAssetDetail",
                type: "date",
                nullable: true);

            migrationBuilder.InsertData(
                table: "MasterEntity",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "Description", "EntityType" },
                values: new object[] { 50, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Puchase Order Part Type List", "PoPartType" });

            migrationBuilder.InsertData(
                table: "MasterEntityData",
                columns: new[] { "Id", "Code", "CreatedBy", "CreatedOn", "IsActive", "MasterEntityId", "ModifiedBy", "ModifiedOn", "Name" },
                values: new object[,]
                {
                    { 211, "POT_OREM", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 50, null, null, "OEM" },
                    { 212, "POT_RFBD", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 50, null, null, "Refurbished" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContractAssetDetail_AssetProductCategoryId",
                table: "ContractAssetDetail",
                column: "AssetProductCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractAssetDetail_CustomerSiteId",
                table: "ContractAssetDetail",
                column: "CustomerSiteId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractAssetDetail_ProductMakeId",
                table: "ContractAssetDetail",
                column: "ProductMakeId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractAssetDetail_ProductModelId",
                table: "ContractAssetDetail",
                column: "ProductModelId");

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAssetDetail_AssetProductCategory_AssetProductCategoryId",
                table: "ContractAssetDetail",
                column: "AssetProductCategoryId",
                principalTable: "AssetProductCategory",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAssetDetail_CustomerSite_CustomerSiteId",
                table: "ContractAssetDetail",
                column: "CustomerSiteId",
                principalTable: "CustomerSite",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAssetDetail_Make_ProductMakeId",
                table: "ContractAssetDetail",
                column: "ProductMakeId",
                principalTable: "Make",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAssetDetail_Product_ProductModelId",
                table: "ContractAssetDetail",
                column: "ProductModelId",
                principalTable: "Product",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAssetDetail_TenantOffice_TenantOfficeId",
                table: "ContractAssetDetail",
                column: "TenantOfficeId",
                principalTable: "TenantOffice",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
