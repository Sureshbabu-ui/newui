using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class table_0_31_alpha_9 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsStandby",
                table: "PartStock",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ReplacedPartId",
                table: "PartStock",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReplacementReason",
                table: "PartStock",
                type: "varchar(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DestinationCustomerSiteId",
                table: "DeliveryChallan",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GeneralNotCovered",
                table: "AssetProductCategory",
                type: "varchar(512)",
                maxLength: 512,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HardwareNotCovered",
                table: "AssetProductCategory",
                type: "varchar(512)",
                maxLength: 512,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SoftwareNotCovered",
                table: "AssetProductCategory",
                type: "varchar(512)",
                maxLength: 512,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ImprestStock",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PartStockId = table.Column<int>(type: "int", nullable: false),
                    CustomerId = table.Column<int>(type: "int", nullable: false),
                    ContractId = table.Column<int>(type: "int", nullable: false),
                    CustomerSiteId = table.Column<int>(type: "int", nullable: true),
                    ServiceEngineerId = table.Column<int>(type: "int", nullable: true),
                    ReservedFrom = table.Column<DateTime>(type: "datetime", nullable: false),
                    ReservedTo = table.Column<DateTime>(type: "datetime", nullable: false),
                    Remarks = table.Column<string>(type: "varchar(128)", maxLength: 128, nullable: true),
                    AllocatedOn = table.Column<DateTime>(type: "datetime", nullable: false),
                    AllocatedBy = table.Column<int>(type: "int", nullable: false),
                    ReleasedOn = table.Column<DateTime>(type: "datetime", nullable: true),
                    ReleasedBy = table.Column<int>(type: "int", nullable: true),
                    ReceivedOn = table.Column<DateTime>(type: "datetime", nullable: true),
                    ReceivedBy = table.Column<int>(type: "int", nullable: true),
                    CustomerHandoverInfo = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    IsCurrentlyDeployed = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImprestStock", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ImprestStock_Contract_ContractId",
                        column: x => x.ContractId,
                        principalTable: "Contract",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ImprestStock_CustomerSite_CustomerSiteId",
                        column: x => x.CustomerSiteId,
                        principalTable: "CustomerSite",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ImprestStock_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ImprestStock_PartStock_PartStockId",
                        column: x => x.PartStockId,
                        principalTable: "PartStock",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ImprestStock_UserInfo_ServiceEngineerId",
                        column: x => x.ServiceEngineerId,
                        principalTable: "UserInfo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "", "", "" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts,Consumables", "Print head", "Drivers(Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer cover, Physical damage, Burnt part, Cables", "", "Drivers(Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts, Datas and Data Backup, Any external devices /Add ons", "CRT  / TFT panel", "O/s & Drivers , Firmware, Patches (Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts , Raibbon Cartridge,Consumables", "Print head", "Drivers(Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts", "", " Firmware, Patches (Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts", "", " Firmware, Patches (Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts , Ink Cartridge, Consumables", "Print Head", "Drivers(Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Burnt , Plastic Parts, Datas and Data Backup, Any external devices /Add onsv", "LCD panel , Battery , Hinges", "O/s & Drivers , Firmware, Patches (Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts , Tonar Cartridge, consumables", "Maintenance kit", "Drivers(Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts , Raibbon Cartridge, Consumables", "Fret /Shuttle Assy/Print Head", "Drivers(Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts", "", " Firmware, Patches (Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts", "", " Firmware, Patches (Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts , Mura", "CRT picture tube / TFT panel", "" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts", "", " Firmware, Patches (Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt part,Consumables", "", "" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "", "", "" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts,Consumables", "Print head", "Drivers(Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 19,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt part, Consumables, Cartridges", "Print Head", "Drivers , Firmware, Patches (Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts, Datas and Data Backup, Any external devices /Add ons", "CRT  / TFT panel", "O/s & Drivers , Firmware, Patches (Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 21,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts,Consumables", "Print head", "Drivers(Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 22,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "", "", "" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts", "", " Firmware, Patches (Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 24,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer cover, Physical damage, Burnt part", "Maintenance kit", "Drivers(Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 25,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts, Datas and Data Backup, Any external devices /Add ons", "Raid card battery", "O/s & Drivers , Firmware, Patches (Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 26,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts, Datas and Data Backup,Media, Any external devices /Add ons", "Cache battery", "O/s & Drivers , Firmware, Patches (Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 27,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts", "", " Firmware, Patches (Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 28,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts, Datas and Data Backup, Any external devices /Add ons", "CRT  / TFT panel", "O/s & Drivers , Firmware, Patches (Media /License has to be provided by customer)" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 29,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt part,Consumables", "Battery", "" });

            migrationBuilder.UpdateData(
                table: "AssetProductCategory",
                keyColumn: "Id",
                keyValue: 30,
                columns: new[] { "GeneralNotCovered", "HardwareNotCovered", "SoftwareNotCovered" },
                values: new object[] { "Outer Cover, Physical damage, Burnt , Plastic Parts, Datas and Data Backup, Any external devices /Add ons", "CRT  / TFT panel", "O/s & Drivers , Firmware, Patches (Media /License has to be provided by customer)" });

            migrationBuilder.InsertData(
                table: "AssetProductCategoryPartNotCovered",
                columns: new[] { "Id", "AssetProductCategoryId", "CreatedBy", "CreatedOn", "IsActive", "PartCategoryId", "UpdatedBy", "UpdatedOn" },
                values: new object[,]
                {
                    { 20, 2, 10, new DateTime(2024, 5, 15, 10, 10, 10, 0, DateTimeKind.Unspecified), true, 65, null, null },
                    { 21, 5, 10, new DateTime(2024, 5, 15, 10, 10, 10, 0, DateTimeKind.Unspecified), true, 65, null, null },
                    { 22, 8, 10, new DateTime(2024, 5, 15, 10, 10, 10, 0, DateTimeKind.Unspecified), true, 65, null, null },
                    { 23, 9, 10, new DateTime(2024, 5, 15, 10, 10, 10, 0, DateTimeKind.Unspecified), true, 6, null, null },
                    { 24, 9, 10, new DateTime(2024, 5, 15, 10, 10, 10, 0, DateTimeKind.Unspecified), true, 42, null, null },
                    { 25, 11, 10, new DateTime(2024, 5, 15, 10, 10, 10, 0, DateTimeKind.Unspecified), true, 65, null, null },
                    { 26, 18, 10, new DateTime(2024, 5, 15, 10, 10, 10, 0, DateTimeKind.Unspecified), true, 65, null, null },
                    { 27, 19, 10, new DateTime(2024, 5, 15, 10, 10, 10, 0, DateTimeKind.Unspecified), true, 65, null, null },
                    { 28, 21, 10, new DateTime(2024, 5, 15, 10, 10, 10, 0, DateTimeKind.Unspecified), true, 65, null, null },
                    { 29, 25, 10, new DateTime(2024, 5, 15, 10, 10, 10, 0, DateTimeKind.Unspecified), true, 6, null, null },
                    { 30, 29, 10, new DateTime(2024, 5, 15, 10, 10, 10, 0, DateTimeKind.Unspecified), true, 6, null, null }
                });

            migrationBuilder.InsertData(
                table: "BusinessModule",
                columns: new[] { "Id", "BusinessModuleName", "CreatedBy", "CreatedOn", "Description", "IsActive", "UpdatedBy", "UpdatedOn" },
                values: new object[] { 19, "Imprest Stock", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Manages the creation and listing of specific imprest stock and its details", true, null, null });

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 225,
                column: "Code",
                value: "CUI_HTLY");

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 227,
                columns: new[] { "Code", "Name" },
                values: new object[] { "CUI_ITES", "ITES" });

            migrationBuilder.InsertData(
                table: "MasterEntityData",
                columns: new[] { "Id", "Code", "CreatedBy", "CreatedOn", "IsActive", "MasterEntityId", "ModifiedBy", "ModifiedOn", "Name" },
                values: new object[,]
                {
                    { 241, "CUI_EDUC", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 56, null, null, "Educational" },
                    { 242, "CUI_BFSI", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 56, null, null, "BFS" },
                    { 243, "CUI_HSPL", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 56, null, null, "Hospital" },
                    { 244, "CUI_MNFC", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 56, null, null, "Manufacturing" },
                    { 245, "CUI_RTAL", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 56, null, null, "Retail" },
                    { 246, "DCN_SITE", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 57, null, null, "Customer Site" }
                });

            migrationBuilder.InsertData(
                table: "BusinessFunction",
                columns: new[] { "Id", "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId", "CreatedBy", "CreatedOn", "Description", "IsActive", "UpdatedBy", "UpdatedOn" },
                values: new object[] { 113, "IMPRESTSTOCK_MANAGE", "Imprest Stock Manage", 19, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null });

            migrationBuilder.CreateIndex(
                name: "IX_PartStock_ReplacedPartId",
                table: "PartStock",
                column: "ReplacedPartId");

            migrationBuilder.CreateIndex(
                name: "IX_DeliveryChallan_DestinationCustomerSiteId",
                table: "DeliveryChallan",
                column: "DestinationCustomerSiteId");

            migrationBuilder.CreateIndex(
                name: "IX_ImprestStock_ContractId",
                table: "ImprestStock",
                column: "ContractId");

            migrationBuilder.CreateIndex(
                name: "IX_ImprestStock_CustomerId",
                table: "ImprestStock",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_ImprestStock_CustomerSiteId",
                table: "ImprestStock",
                column: "CustomerSiteId");

            migrationBuilder.CreateIndex(
                name: "IX_ImprestStock_PartStockId",
                table: "ImprestStock",
                column: "PartStockId");

            migrationBuilder.CreateIndex(
                name: "IX_ImprestStock_ServiceEngineerId",
                table: "ImprestStock",
                column: "ServiceEngineerId");

            migrationBuilder.AddForeignKey(
                name: "FK_DeliveryChallan_CustomerSite_DestinationCustomerSiteId",
                table: "DeliveryChallan",
                column: "DestinationCustomerSiteId",
                principalTable: "CustomerSite",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PartStock_Part_ReplacedPartId",
                table: "PartStock",
                column: "ReplacedPartId",
                principalTable: "Part",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DeliveryChallan_CustomerSite_DestinationCustomerSiteId",
                table: "DeliveryChallan");

            migrationBuilder.DropForeignKey(
                name: "FK_PartStock_Part_ReplacedPartId",
                table: "PartStock");

            migrationBuilder.DropTable(
                name: "ImprestStock");

            migrationBuilder.DropIndex(
                name: "IX_PartStock_ReplacedPartId",
                table: "PartStock");

            migrationBuilder.DropIndex(
                name: "IX_DeliveryChallan_DestinationCustomerSiteId",
                table: "DeliveryChallan");

            migrationBuilder.DeleteData(
                table: "AssetProductCategoryPartNotCovered",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "AssetProductCategoryPartNotCovered",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "AssetProductCategoryPartNotCovered",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "AssetProductCategoryPartNotCovered",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "AssetProductCategoryPartNotCovered",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "AssetProductCategoryPartNotCovered",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "AssetProductCategoryPartNotCovered",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "AssetProductCategoryPartNotCovered",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "AssetProductCategoryPartNotCovered",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "AssetProductCategoryPartNotCovered",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "AssetProductCategoryPartNotCovered",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 113);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 241);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 242);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 243);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 244);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 245);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 246);

            migrationBuilder.DeleteData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DropColumn(
                name: "IsStandby",
                table: "PartStock");

            migrationBuilder.DropColumn(
                name: "ReplacedPartId",
                table: "PartStock");

            migrationBuilder.DropColumn(
                name: "ReplacementReason",
                table: "PartStock");

            migrationBuilder.DropColumn(
                name: "DestinationCustomerSiteId",
                table: "DeliveryChallan");

            migrationBuilder.DropColumn(
                name: "GeneralNotCovered",
                table: "AssetProductCategory");

            migrationBuilder.DropColumn(
                name: "HardwareNotCovered",
                table: "AssetProductCategory");

            migrationBuilder.DropColumn(
                name: "SoftwareNotCovered",
                table: "AssetProductCategory");

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 225,
                column: "Code",
                value: "CUI_HPTL");

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 227,
                columns: new[] { "Code", "Name" },
                values: new object[] { "CUI_ITSI", "ITS" });
        }
    }
}
