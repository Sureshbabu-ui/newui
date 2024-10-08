using System;
using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class table_v0_005 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApprovalRequest_MasterEntityData_ReviewStatus",
                table: "ApprovalRequest");

            migrationBuilder.DropForeignKey(
                name: "FK_ApprovalRequestDetail_MasterEntityData_ReviewStatus",
                table: "ApprovalRequestDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_ApprovalRequestDetail_TenantOffice_TenantOfficeId",
                table: "ApprovalRequestDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractAssetDetail_MasterEntityData_PmFrequencyId",
                table: "ContractAssetDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractAssetDetail_MasterEntityData_ProductPreAmcConditionId",
                table: "ContractAssetDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractAssetDetail_MasterEntityData_ProductSupportTypeDataId",
                table: "ContractAssetDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractAssetSummary_MasterEntityData_PCAtBookingId",
                table: "ContractAssetSummary");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractAssetSummary_MasterEntityData_PMFrequencyId",
                table: "ContractAssetSummary");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractDocument_MasterEntityData_ContractDocumentCategoryId",
                table: "ContractDocument");

            migrationBuilder.DropForeignKey(
                name: "FK_PurchaseOrder_MasterEntityData_PurchaseOrderStatusId",
                table: "PurchaseOrder");

            migrationBuilder.DropForeignKey(
                name: "FK_TenantOffice_MasterEntityData_TenantOfficeTypeId",
                table: "TenantOffice");

            migrationBuilder.DropIndex(
                name: "IX_TenantOffice_TenantOfficeTypeId",
                table: "TenantOffice");

            migrationBuilder.DropIndex(
                name: "IX_PurchaseOrder_PurchaseOrderStatusId",
                table: "PurchaseOrder");

            migrationBuilder.DropIndex(
                name: "IX_ContractDocument_ContractDocumentCategoryId",
                table: "ContractDocument");

            migrationBuilder.DropIndex(
                name: "IX_ContractAssetSummary_PCAtBookingId",
                table: "ContractAssetSummary");

            migrationBuilder.DropIndex(
                name: "IX_ContractAssetSummary_PMFrequencyId",
                table: "ContractAssetSummary");

            migrationBuilder.DropIndex(
                name: "IX_ContractAssetDetail_PmFrequencyId",
                table: "ContractAssetDetail");

            migrationBuilder.DropIndex(
                name: "IX_ApprovalRequestDetail_ReviewStatus",
                table: "ApprovalRequestDetail");

            migrationBuilder.DropIndex(
                name: "IX_ApprovalRequest_ReviewStatus",
                table: "ApprovalRequest");

            migrationBuilder.DropColumn(
                name: "TenantOfficeTypeId",
                table: "TenantOffice");

            migrationBuilder.DropColumn(
                name: "PurchaseOrderStatusId",
                table: "PurchaseOrder");

            migrationBuilder.DropColumn(
                name: "MaximumStockLevel",
                table: "Part");

            migrationBuilder.DropColumn(
                name: "MinimumStockLevel",
                table: "Part");

            migrationBuilder.DropColumn(
                name: "ReorderQuantity",
                table: "Part");

            migrationBuilder.DropColumn(
                name: "EffectiveFrom",
                table: "DocumentNumberSeries");

            migrationBuilder.DropColumn(
                name: "Separator",
                table: "DocumentNumberSeries");

            migrationBuilder.DropColumn(
                name: "ContractDocumentCategoryId",
                table: "ContractDocument");

            migrationBuilder.DropColumn(
                name: "AuditedDefectiveProducts",
                table: "ContractAssetSummary");

            migrationBuilder.DropColumn(
                name: "AuditedGoodProducts",
                table: "ContractAssetSummary");

            migrationBuilder.DropColumn(
                name: "AuditedProductFound",
                table: "ContractAssetSummary");

            migrationBuilder.DropColumn(
                name: "AuditedProductNotFound",
                table: "ContractAssetSummary");

            migrationBuilder.DropColumn(
                name: "IsOutsourcingNeeded",
                table: "ContractAssetSummary");

            migrationBuilder.DropColumn(
                name: "IsPreventiveMaintenanceNeeded",
                table: "ContractAssetSummary");

            migrationBuilder.DropColumn(
                name: "PCAtBookingId",
                table: "ContractAssetSummary");

            migrationBuilder.DropColumn(
                name: "PMFrequencyId",
                table: "ContractAssetSummary");

            migrationBuilder.DropColumn(
                name: "PendingProductCountToBeUploaded",
                table: "ContractAssetSummary");

            migrationBuilder.DropColumn(
                name: "PreventiveMaintenanceFrequency",
                table: "ContractAssetSummary");

            migrationBuilder.DropColumn(
                name: "PreventiveMaintenanceStartDate",
                table: "ContractAssetSummary");

            migrationBuilder.DropColumn(
                name: "ProductCountUploaded",
                table: "ContractAssetSummary");

            migrationBuilder.DropColumn(
                name: "Remarks",
                table: "ContractAssetSummary");

            migrationBuilder.DropColumn(
                name: "ResolutionTimeInHours",
                table: "ContractAssetSummary");

            migrationBuilder.DropColumn(
                name: "ResponseTimeInHours",
                table: "ContractAssetSummary");

            migrationBuilder.DropColumn(
                name: "StandByTimeInHours",
                table: "ContractAssetSummary");

            migrationBuilder.DropColumn(
                name: "PmFrequencyId",
                table: "ContractAssetDetail");

            migrationBuilder.DropColumn(
                name: "PreventiveMaintenanceFrequency",
                table: "ContractAssetDetail");

            migrationBuilder.DropColumn(
                name: "ProductCondition",
                table: "ContractAssetDetail");

            migrationBuilder.DropColumn(
                name: "ApprovedBy",
                table: "Bank");

            migrationBuilder.DropColumn(
                name: "ApprovedOn",
                table: "Bank");

            migrationBuilder.DropColumn(
                name: "CaseId",
                table: "ApprovalRequestDetail");

            migrationBuilder.DropColumn(
                name: "ReviewStatus",
                table: "ApprovalRequestDetail");

            migrationBuilder.DropColumn(
                name: "UpdatedOn",
                table: "ApprovalRequestDetail");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "ApprovalRequest");

            migrationBuilder.DropColumn(
                name: "DeletedOn",
                table: "ApprovalRequest");

            migrationBuilder.DropColumn(
                name: "ReviewComment",
                table: "ApprovalRequest");

            migrationBuilder.DropColumn(
                name: "ReviewStatus",
                table: "ApprovalRequest");

            migrationBuilder.DropColumn(
                name: "ReviewedOn",
                table: "ApprovalRequest");

            migrationBuilder.DropColumn(
                name: "TableName",
                table: "ApprovalRequest");

            migrationBuilder.DropColumn(
                name: "UpdatedOn",
                table: "ApprovalRequest");

            migrationBuilder.RenameColumn(
                name: "ProductSupportTypeDataId",
                table: "ContractAssetDetail",
                newName: "ProductSupportTypeId");

            migrationBuilder.RenameColumn(
                name: "ProductSupportType",
                table: "ContractAssetDetail",
                newName: "ProductConditionId");

            migrationBuilder.RenameColumn(
                name: "ProductPreAmcConditionId",
                table: "ContractAssetDetail",
                newName: "PreventiveMaintenanceFrequencyId");

            migrationBuilder.RenameIndex(
                name: "IX_ContractAssetDetail_ProductSupportTypeDataId",
                table: "ContractAssetDetail",
                newName: "IX_ContractAssetDetail_ProductSupportTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_ContractAssetDetail_ProductPreAmcConditionId",
                table: "ContractAssetDetail",
                newName: "IX_ContractAssetDetail_PreventiveMaintenanceFrequencyId");

            migrationBuilder.RenameColumn(
                name: "UpdatedBy",
                table: "ApprovalRequestDetail",
                newName: "ReviewStatusId");

            migrationBuilder.RenameColumn(
                name: "TenantOfficeId",
                table: "ApprovalRequestDetail",
                newName: "ApprovalRequestId");

            migrationBuilder.RenameIndex(
                name: "IX_ApprovalRequestDetail_TenantOfficeId",
                table: "ApprovalRequestDetail",
                newName: "IX_ApprovalRequestDetail_ApprovalRequestId");

            migrationBuilder.RenameColumn(
                name: "UpdatedBy",
                table: "ApprovalRequest",
                newName: "ReviewStatusId");

            migrationBuilder.RenameColumn(
                name: "ReviewedBy",
                table: "ApprovalRequest",
                newName: "ApprovedRecordId");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "ApprovalRequest",
                newName: "IsCompleted");

            migrationBuilder.AddColumn<int>(
                name: "CallSeverityLevelId",
                table: "ServiceRequest",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "ApprovalWorkflow",
                type: "varchar(16)",
                maxLength: 16,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "char(16)",
                oldMaxLength: 16);

            migrationBuilder.AlterColumn<string>(
                name: "ReviewComment",
                table: "ApprovalRequestDetail",
                type: "varchar(128)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(MAX)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ApprovalWorkflowId",
                table: "ApprovalRequest",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TenantOfficeId",
                table: "ApprovalRequest",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ContractAssetPmDetail",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ContractAssetDetailId = table.Column<int>(type: "int", nullable: false),
                    PmScheduledDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    PmDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    PmEngineerId = table.Column<int>(type: "int", nullable: true),
                    PmNote = table.Column<string>(type: "varchar(1024)", maxLength: 1024, nullable: true),
                    PmVendorId = table.Column<int>(type: "int", nullable: true),
                    CustomerSiteId = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractAssetPmDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContractAssetPmDetail_ContractAssetDetail_ContractAssetDetailId",
                        column: x => x.ContractAssetDetailId,
                        principalTable: "ContractAssetDetail",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ContractAssetPmDetail_CustomerSite_CustomerSiteId",
                        column: x => x.CustomerSiteId,
                        principalTable: "CustomerSite",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ContractAssetPmDetail_UserInfo_PmEngineerId",
                        column: x => x.PmEngineerId,
                        principalTable: "UserInfo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ContractAssetPmDetail_Vendor_PmVendorId",
                        column: x => x.PmVendorId,
                        principalTable: "Vendor",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DocumentNumberFormat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DocumentTypeId = table.Column<int>(type: "int", nullable: false),
                    Format = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: false),
                    NumberPadding = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime", nullable: false),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    ModifiedOn = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentNumberFormat", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DocumentNumberFormat_MasterEntityData_DocumentTypeId",
                        column: x => x.DocumentTypeId,
                        principalTable: "MasterEntityData",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FailedJob",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IsPlannedob = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    CommandName = table.Column<string>(type: "varchar(1024)", maxLength: 1024, nullable: false),
                    Params = table.Column<string>(type: "nvarchar(MAX)", nullable: false),
                    FailedAttempts = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    FailedReason = table.Column<string>(type: "varchar(1024)", maxLength: 1024, nullable: false),
                    LastFailedOn = table.Column<DateTime>(type: "datetime", nullable: true),
                    IsCompleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsSuccess = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FailedJob", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Job",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IsPlannedob = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    CommandName = table.Column<string>(type: "varchar(1024)", maxLength: 1024, nullable: false),
                    Params = table.Column<string>(type: "nvarchar(MAX)", nullable: false),
                    FailedAttempts = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    FailedReason = table.Column<string>(type: "varchar(1024)", maxLength: 1024, nullable: false),
                    LastFailedOn = table.Column<DateTime>(type: "datetime", nullable: true),
                    IsCompleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsSuccess = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Job", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PlannedJob",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    CommandName = table.Column<string>(type: "varchar(1024)", maxLength: 1024, nullable: false),
                    Params = table.Column<string>(type: "nvarchar(MAX)", nullable: false),
                    FirstRunOn = table.Column<DateTime>(type: "datetime", nullable: false),
                    LastRunOn = table.Column<DateTime>(type: "datetime", nullable: true),
                    Schedule = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlannedJob", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PostalCode",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Pincode = table.Column<string>(type: "varchar(16)", maxLength: 16, nullable: false),
                    PostOfficeName = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    TenantOfficeId = table.Column<int>(type: "int", nullable: false),
                    CityId = table.Column<int>(type: "int", nullable: false),
                    StateId = table.Column<int>(type: "int", nullable: false),
                    CountryId = table.Column<int>(type: "int", nullable: false),
                    GeoCoordinates = table.Column<Point>(type: "geography", nullable: true),
                    TimeZone = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedOn = table.Column<DateTime>(type: "datetime", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostalCode", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PostalCode_City_CityId",
                        column: x => x.CityId,
                        principalTable: "City",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PostalCode_Country_CountryId",
                        column: x => x.CountryId,
                        principalTable: "Country",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PostalCode_State_StateId",
                        column: x => x.StateId,
                        principalTable: "State",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PostalCode_TenantOffice_TenantOfficeId",
                        column: x => x.TenantOfficeId,
                        principalTable: "TenantOffice",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "ApprovalWorkflow",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Code", "Description", "Name" },
                values: new object[] { "AWF_USER_CREATE", "Configure the multilevel approval system for user creation to ensure thorough review and authorization at each stage. Customize the approval hierarchy and criteria to match your organizational needs", "User Create" });

            migrationBuilder.UpdateData(
                table: "ApprovalWorkflow",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Code", "Description", "Name" },
                values: new object[] { "AWF_USER_EDIT", "Configure the multilevel approval system for user edit to ensure thorough review and authorization at each stage. Customize the approval hierarchy and criteria to match your organizational needs", "User Edit" });

            migrationBuilder.InsertData(
                table: "ApprovalWorkflow",
                columns: new[] { "Id", "Code", "CreatedBy", "CreatedOn", "Description", "IsActive", "ModifiedBy", "ModifiedOn", "Name" },
                values: new object[,]
                {
                    { 3, "AWF_PART_CREATE", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Configure the multilevel approval system for part creation to ensure thorough review and authorization at each stage. Customize the approval hierarchy and criteria to match your organizational needs", true, null, null, "Part" },
                    { 4, "AFW_BANK_CREATE", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Configure the multilevel approval system for bank creation to ensure thorough review and authorization at each stage. Customize the approval hierarchy and criteria to match your organizational needs", true, null, null, "Bank Create" },
                    { 5, "AFW_BANK_UPDATE", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Configure the multilevel approval system for bank edit to ensure thorough review and authorization at each stage. Customize the approval hierarchy and criteria to match your organizational needs", true, null, null, "Bank Edit" }
                });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 39,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName" },
                values: new object[] { "APPROVAL_MANAGE", "Approval Manage" });

            migrationBuilder.InsertData(
                table: "BusinessFunction",
                columns: new[] { "Id", "BusinessFunctionCode", "BusinessFunctionName", "BusinessFunctionTypeId", "BusinessModuleId", "CreatedBy", "CreatedOn", "Description", "IsActive", "UpdatedBy", "UpdatedOn" },
                values: new object[,]
                {
                    { 120, "CONTRACT_DASHBOARD_BOOKINGDETAIL_VIEW", "Contract Booked Total Count", 275, 1, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 121, "CONTRACT_DASHBOARD_INVOICECOLLECTION_MADE_VIEW", "Contract Invoice Total Collected Amount", 275, 1, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 122, "CONTRACT_DASHBOARD_INVOICECOLLECTION_PENDING_VIEW", "Contract Invoice Collection Pending Count", 275, 1, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 123, "CONTRACT_DASHBOARD_INVOICES_RAISED_VIEW", "Contract Total Raised Invoices", 275, 1, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 124, "CONTRACT_DASHBOARD_REVENUERECOGNITION_VIEW", "Contracts Revenue Recognition Value", 275, 1, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 125, "CONTRACT_ACCOUNTS", "Contract Accounts", 275, 1, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null }
                });

            migrationBuilder.InsertData(
                table: "InvoicePrerequisite",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "Description", "DocumentCode", "DocumentName", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[,]
                {
                    { 8, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, null, "ESICHALN", "ESI Challan", true, false, null, null },
                    { 9, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, null, "STPCHALN", "Service Tax Paid Challan", true, false, null, null },
                    { 10, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, null, "NDA", "NDA", true, false, null, null },
                    { 11, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, null, "NCPRPRT", "No call pending report", true, false, null, null },
                    { 12, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, null, "REATDANC", "RE Attendance", true, false, null, null },
                    { 13, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, null, "POFATRNY", "Power Of Attorney", true, false, null, null },
                    { 14, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, null, "SEGSTEZ", "SEG - Service Tax Exemption Zone", true, false, null, null },
                    { 15, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, null, "NOTREQRD", "Not required", true, false, null, null }
                });

            migrationBuilder.InsertData(
                table: "MasterEntity",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "Description", "EntityType" },
                values: new object[] { 64, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Call Severity Levels", "CallSeverityLevel" });

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "Code", "Name" },
                values: new object[] { "SMD_RMOT", "Remote" });

            migrationBuilder.InsertData(
                table: "MasterEntityData",
                columns: new[] { "Id", "Code", "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "MasterEntityId", "ModifiedBy", "ModifiedOn", "Name" },
                values: new object[,]
                {
                    { 288, "SMD_TKEY", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 3, null, null, "Turnkey (OTS)" },
                    { 289, "PPC_NFND", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 32, null, null, "Not Found" },
                    { 285, "CSL_LLOW", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 64, null, null, "Low" },
                    { 286, "CSL_MDUM", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 64, null, null, "Medium" },
                    { 287, "CSL_HIGH", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 64, null, null, "High" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_TenantOffice_OfficeTypeId",
                table: "TenantOffice",
                column: "OfficeTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRequest_CallSeverityLevelId",
                table: "ServiceRequest",
                column: "CallSeverityLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrder_PoStatusId",
                table: "PurchaseOrder",
                column: "PoStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractDocument_DocumentCategoryId",
                table: "ContractDocument",
                column: "DocumentCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractAssetDetail_ProductConditionId",
                table: "ContractAssetDetail",
                column: "ProductConditionId");

            migrationBuilder.CreateIndex(
                name: "IX_ApprovalRequestDetail_ReviewStatusId",
                table: "ApprovalRequestDetail",
                column: "ReviewStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_ApprovalRequest_ApprovalWorkflowId",
                table: "ApprovalRequest",
                column: "ApprovalWorkflowId");

            migrationBuilder.CreateIndex(
                name: "IX_ApprovalRequest_ReviewStatusId",
                table: "ApprovalRequest",
                column: "ReviewStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_ApprovalRequest_TenantOfficeId",
                table: "ApprovalRequest",
                column: "TenantOfficeId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractAssetPmDetail_ContractAssetDetailId",
                table: "ContractAssetPmDetail",
                column: "ContractAssetDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractAssetPmDetail_CustomerSiteId",
                table: "ContractAssetPmDetail",
                column: "CustomerSiteId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractAssetPmDetail_PmEngineerId",
                table: "ContractAssetPmDetail",
                column: "PmEngineerId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractAssetPmDetail_PmVendorId",
                table: "ContractAssetPmDetail",
                column: "PmVendorId");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentNumberFormat_DocumentTypeId",
                table: "DocumentNumberFormat",
                column: "DocumentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PostalCode_CityId",
                table: "PostalCode",
                column: "CityId");

            migrationBuilder.CreateIndex(
                name: "IX_PostalCode_CountryId",
                table: "PostalCode",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_PostalCode_StateId",
                table: "PostalCode",
                column: "StateId");

            migrationBuilder.CreateIndex(
                name: "IX_PostalCode_TenantOfficeId",
                table: "PostalCode",
                column: "TenantOfficeId");

            migrationBuilder.AddForeignKey(
                name: "FK_ApprovalRequest_ApprovalWorkflow_ApprovalWorkflowId",
                table: "ApprovalRequest",
                column: "ApprovalWorkflowId",
                principalTable: "ApprovalWorkflow",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ApprovalRequest_MasterEntityData_ReviewStatusId",
                table: "ApprovalRequest",
                column: "ReviewStatusId",
                principalTable: "MasterEntityData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ApprovalRequest_TenantOffice_TenantOfficeId",
                table: "ApprovalRequest",
                column: "TenantOfficeId",
                principalTable: "TenantOffice",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ApprovalRequestDetail_ApprovalRequest_ApprovalRequestId",
                table: "ApprovalRequestDetail",
                column: "ApprovalRequestId",
                principalTable: "ApprovalRequest",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ApprovalRequestDetail_MasterEntityData_ReviewStatusId",
                table: "ApprovalRequestDetail",
                column: "ReviewStatusId",
                principalTable: "MasterEntityData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAssetDetail_MasterEntityData_PreventiveMaintenanceFrequencyId",
                table: "ContractAssetDetail",
                column: "PreventiveMaintenanceFrequencyId",
                principalTable: "MasterEntityData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAssetDetail_MasterEntityData_ProductConditionId",
                table: "ContractAssetDetail",
                column: "ProductConditionId",
                principalTable: "MasterEntityData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAssetDetail_MasterEntityData_ProductSupportTypeId",
                table: "ContractAssetDetail",
                column: "ProductSupportTypeId",
                principalTable: "MasterEntityData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractDocument_MasterEntityData_DocumentCategoryId",
                table: "ContractDocument",
                column: "DocumentCategoryId",
                principalTable: "MasterEntityData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PurchaseOrder_MasterEntityData_PoStatusId",
                table: "PurchaseOrder",
                column: "PoStatusId",
                principalTable: "MasterEntityData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceRequest_MasterEntityData_CallSeverityLevelId",
                table: "ServiceRequest",
                column: "CallSeverityLevelId",
                principalTable: "MasterEntityData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TenantOffice_MasterEntityData_OfficeTypeId",
                table: "TenantOffice",
                column: "OfficeTypeId",
                principalTable: "MasterEntityData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApprovalRequest_ApprovalWorkflow_ApprovalWorkflowId",
                table: "ApprovalRequest");

            migrationBuilder.DropForeignKey(
                name: "FK_ApprovalRequest_MasterEntityData_ReviewStatusId",
                table: "ApprovalRequest");

            migrationBuilder.DropForeignKey(
                name: "FK_ApprovalRequest_TenantOffice_TenantOfficeId",
                table: "ApprovalRequest");

            migrationBuilder.DropForeignKey(
                name: "FK_ApprovalRequestDetail_ApprovalRequest_ApprovalRequestId",
                table: "ApprovalRequestDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_ApprovalRequestDetail_MasterEntityData_ReviewStatusId",
                table: "ApprovalRequestDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractAssetDetail_MasterEntityData_PreventiveMaintenanceFrequencyId",
                table: "ContractAssetDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractAssetDetail_MasterEntityData_ProductConditionId",
                table: "ContractAssetDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractAssetDetail_MasterEntityData_ProductSupportTypeId",
                table: "ContractAssetDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractDocument_MasterEntityData_DocumentCategoryId",
                table: "ContractDocument");

            migrationBuilder.DropForeignKey(
                name: "FK_PurchaseOrder_MasterEntityData_PoStatusId",
                table: "PurchaseOrder");

            migrationBuilder.DropForeignKey(
                name: "FK_ServiceRequest_MasterEntityData_CallSeverityLevelId",
                table: "ServiceRequest");

            migrationBuilder.DropForeignKey(
                name: "FK_TenantOffice_MasterEntityData_OfficeTypeId",
                table: "TenantOffice");

            migrationBuilder.DropTable(
                name: "ContractAssetPmDetail");

            migrationBuilder.DropTable(
                name: "DocumentNumberFormat");

            migrationBuilder.DropTable(
                name: "FailedJob");

            migrationBuilder.DropTable(
                name: "Job");

            migrationBuilder.DropTable(
                name: "PlannedJob");

            migrationBuilder.DropTable(
                name: "PostalCode");

            migrationBuilder.DropIndex(
                name: "IX_TenantOffice_OfficeTypeId",
                table: "TenantOffice");

            migrationBuilder.DropIndex(
                name: "IX_ServiceRequest_CallSeverityLevelId",
                table: "ServiceRequest");

            migrationBuilder.DropIndex(
                name: "IX_PurchaseOrder_PoStatusId",
                table: "PurchaseOrder");

            migrationBuilder.DropIndex(
                name: "IX_ContractDocument_DocumentCategoryId",
                table: "ContractDocument");

            migrationBuilder.DropIndex(
                name: "IX_ContractAssetDetail_ProductConditionId",
                table: "ContractAssetDetail");

            migrationBuilder.DropIndex(
                name: "IX_ApprovalRequestDetail_ReviewStatusId",
                table: "ApprovalRequestDetail");

            migrationBuilder.DropIndex(
                name: "IX_ApprovalRequest_ApprovalWorkflowId",
                table: "ApprovalRequest");

            migrationBuilder.DropIndex(
                name: "IX_ApprovalRequest_ReviewStatusId",
                table: "ApprovalRequest");

            migrationBuilder.DropIndex(
                name: "IX_ApprovalRequest_TenantOfficeId",
                table: "ApprovalRequest");

            migrationBuilder.DeleteData(
                table: "ApprovalWorkflow",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "ApprovalWorkflow",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "ApprovalWorkflow",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 120);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 121);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 122);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 123);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 124);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 125);

            migrationBuilder.DeleteData(
                table: "InvoicePrerequisite",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "InvoicePrerequisite",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "InvoicePrerequisite",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "InvoicePrerequisite",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "InvoicePrerequisite",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "InvoicePrerequisite",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "InvoicePrerequisite",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "InvoicePrerequisite",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 285);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 286);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 287);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 288);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 289);

            migrationBuilder.DeleteData(
                table: "MasterEntity",
                keyColumn: "Id",
                keyValue: 64);

            migrationBuilder.DropColumn(
                name: "CallSeverityLevelId",
                table: "ServiceRequest");

            migrationBuilder.DropColumn(
                name: "ApprovalWorkflowId",
                table: "ApprovalRequest");

            migrationBuilder.DropColumn(
                name: "TenantOfficeId",
                table: "ApprovalRequest");

            migrationBuilder.RenameColumn(
                name: "ProductSupportTypeId",
                table: "ContractAssetDetail",
                newName: "ProductSupportTypeDataId");

            migrationBuilder.RenameColumn(
                name: "ProductConditionId",
                table: "ContractAssetDetail",
                newName: "ProductSupportType");

            migrationBuilder.RenameColumn(
                name: "PreventiveMaintenanceFrequencyId",
                table: "ContractAssetDetail",
                newName: "ProductPreAmcConditionId");

            migrationBuilder.RenameIndex(
                name: "IX_ContractAssetDetail_ProductSupportTypeId",
                table: "ContractAssetDetail",
                newName: "IX_ContractAssetDetail_ProductSupportTypeDataId");

            migrationBuilder.RenameIndex(
                name: "IX_ContractAssetDetail_PreventiveMaintenanceFrequencyId",
                table: "ContractAssetDetail",
                newName: "IX_ContractAssetDetail_ProductPreAmcConditionId");

            migrationBuilder.RenameColumn(
                name: "ReviewStatusId",
                table: "ApprovalRequestDetail",
                newName: "UpdatedBy");

            migrationBuilder.RenameColumn(
                name: "ApprovalRequestId",
                table: "ApprovalRequestDetail",
                newName: "TenantOfficeId");

            migrationBuilder.RenameIndex(
                name: "IX_ApprovalRequestDetail_ApprovalRequestId",
                table: "ApprovalRequestDetail",
                newName: "IX_ApprovalRequestDetail_TenantOfficeId");

            migrationBuilder.RenameColumn(
                name: "ReviewStatusId",
                table: "ApprovalRequest",
                newName: "UpdatedBy");

            migrationBuilder.RenameColumn(
                name: "IsCompleted",
                table: "ApprovalRequest",
                newName: "IsDeleted");

            migrationBuilder.RenameColumn(
                name: "ApprovedRecordId",
                table: "ApprovalRequest",
                newName: "ReviewedBy");

            migrationBuilder.AddColumn<int>(
                name: "TenantOfficeTypeId",
                table: "TenantOffice",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PurchaseOrderStatusId",
                table: "PurchaseOrder",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaximumStockLevel",
                table: "Part",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MinimumStockLevel",
                table: "Part",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "ReorderQuantity",
                table: "Part",
                type: "decimal(16,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "EffectiveFrom",
                table: "DocumentNumberSeries",
                type: "datetime",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Separator",
                table: "DocumentNumberSeries",
                type: "varchar(8)",
                maxLength: 8,
                nullable: false,
                defaultValue: "-");

            migrationBuilder.AddColumn<int>(
                name: "ContractDocumentCategoryId",
                table: "ContractDocument",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AuditedDefectiveProducts",
                table: "ContractAssetSummary",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AuditedGoodProducts",
                table: "ContractAssetSummary",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AuditedProductFound",
                table: "ContractAssetSummary",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AuditedProductNotFound",
                table: "ContractAssetSummary",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsOutsourcingNeeded",
                table: "ContractAssetSummary",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsPreventiveMaintenanceNeeded",
                table: "ContractAssetSummary",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "PCAtBookingId",
                table: "ContractAssetSummary",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PMFrequencyId",
                table: "ContractAssetSummary",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PendingProductCountToBeUploaded",
                table: "ContractAssetSummary",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PreventiveMaintenanceFrequency",
                table: "ContractAssetSummary",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PreventiveMaintenanceStartDate",
                table: "ContractAssetSummary",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProductCountUploaded",
                table: "ContractAssetSummary",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Remarks",
                table: "ContractAssetSummary",
                type: "varchar(1024)",
                maxLength: 1024,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ResolutionTimeInHours",
                table: "ContractAssetSummary",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ResponseTimeInHours",
                table: "ContractAssetSummary",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "StandByTimeInHours",
                table: "ContractAssetSummary",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PmFrequencyId",
                table: "ContractAssetDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PreventiveMaintenanceFrequency",
                table: "ContractAssetDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProductCondition",
                table: "ContractAssetDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ApprovedBy",
                table: "Bank",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "ApprovedOn",
                table: "Bank",
                type: "datetime",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "ApprovalWorkflow",
                type: "char(16)",
                maxLength: 16,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16);

            migrationBuilder.AlterColumn<string>(
                name: "ReviewComment",
                table: "ApprovalRequestDetail",
                type: "nvarchar(MAX)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(128)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CaseId",
                table: "ApprovalRequestDetail",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReviewStatus",
                table: "ApprovalRequestDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedOn",
                table: "ApprovalRequestDetail",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedBy",
                table: "ApprovalRequest",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedOn",
                table: "ApprovalRequest",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReviewComment",
                table: "ApprovalRequest",
                type: "nvarchar(MAX)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ReviewStatus",
                table: "ApprovalRequest",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReviewedOn",
                table: "ApprovalRequest",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TableName",
                table: "ApprovalRequest",
                type: "varchar(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedOn",
                table: "ApprovalRequest",
                type: "datetime",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "ApprovalWorkflow",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Code", "Description", "Name" },
                values: new object[] { "AFW_CUST", "Configure the multilevel approval system for customer creation to ensure thorough review and authorization at each stage. Customize the approval hierarchy and criteria to match your organizational needs", "Customer" });

            migrationBuilder.UpdateData(
                table: "ApprovalWorkflow",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Code", "Description", "Name" },
                values: new object[] { "AFW_PART", "Configure the multilevel approval system for part creation to ensure thorough review and authorization at each stage. Customize the approval hierarchy and criteria to match your organizational needs", "Part" });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 19,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 21,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 22,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 24,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 25,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 26,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 27,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 28,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 29,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 30,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 31,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 32,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 33,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 34,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 35,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 36,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 37,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 38,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 39,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 40,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 41,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 42,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 43,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 44,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 45,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 46,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 47,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 48,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 49,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 50,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 51,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 52,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 53,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 54,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 55,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 56,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 57,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 58,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 59,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 60,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 61,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 62,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 63,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 64,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 65,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 66,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 67,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 68,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 69,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 70,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 71,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 72,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 73,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 74,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 75,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 76,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 77,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 78,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 79,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 80,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 81,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 82,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 83,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 84,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 85,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 86,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 87,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 88,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 89,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 90,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 91,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 92,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 93,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 94,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 95,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 96,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 97,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 98,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 99,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 100,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 101,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 102,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 103,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 104,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 105,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 106,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 107,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 108,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 109,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 110,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 111,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 112,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 113,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 114,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 115,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 116,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 117,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 118,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 119,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 120,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 121,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 122,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 123,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 124,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 125,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 126,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 127,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 128,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 129,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 130,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 131,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 132,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 133,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 134,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 135,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 136,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 137,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 138,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 139,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 140,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 141,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 142,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 143,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 144,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 145,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 146,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 147,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 148,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 149,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 150,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 151,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 152,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 153,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 154,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 155,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 156,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 157,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 158,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 159,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 160,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 161,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 162,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 163,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 164,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 165,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 166,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 167,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 168,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Bank",
                keyColumn: "Id",
                keyValue: 169,
                columns: new[] { "ApprovedBy", "ApprovedOn" },
                values: new object[] { 8, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 39,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName" },
                values: new object[] { "APPROVAL_DELETE", "Approval Delete" });

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "Code", "Name" },
                values: new object[] { "SMD_ONCL", "On-Call" });

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 1,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 2,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 3,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 4,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 5,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 6,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 7,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 8,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 9,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 10,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 11,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 12,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 13,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 14,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 15,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 16,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 17,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 18,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 19,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 20,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 21,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 22,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 23,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 24,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 25,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 26,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 27,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 28,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 29,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 30,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 31,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 32,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 33,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 34,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 35,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 36,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 37,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 38,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 39,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 40,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 41,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 42,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 43,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 44,
                column: "TenantOfficeTypeId",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_TenantOffice_TenantOfficeTypeId",
                table: "TenantOffice",
                column: "TenantOfficeTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrder_PurchaseOrderStatusId",
                table: "PurchaseOrder",
                column: "PurchaseOrderStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractDocument_ContractDocumentCategoryId",
                table: "ContractDocument",
                column: "ContractDocumentCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractAssetSummary_PCAtBookingId",
                table: "ContractAssetSummary",
                column: "PCAtBookingId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractAssetSummary_PMFrequencyId",
                table: "ContractAssetSummary",
                column: "PMFrequencyId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractAssetDetail_PmFrequencyId",
                table: "ContractAssetDetail",
                column: "PmFrequencyId");

            migrationBuilder.CreateIndex(
                name: "IX_ApprovalRequestDetail_ReviewStatus",
                table: "ApprovalRequestDetail",
                column: "ReviewStatus");

            migrationBuilder.CreateIndex(
                name: "IX_ApprovalRequest_ReviewStatus",
                table: "ApprovalRequest",
                column: "ReviewStatus");

            migrationBuilder.AddForeignKey(
                name: "FK_ApprovalRequest_MasterEntityData_ReviewStatus",
                table: "ApprovalRequest",
                column: "ReviewStatus",
                principalTable: "MasterEntityData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ApprovalRequestDetail_MasterEntityData_ReviewStatus",
                table: "ApprovalRequestDetail",
                column: "ReviewStatus",
                principalTable: "MasterEntityData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ApprovalRequestDetail_TenantOffice_TenantOfficeId",
                table: "ApprovalRequestDetail",
                column: "TenantOfficeId",
                principalTable: "TenantOffice",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAssetDetail_MasterEntityData_PmFrequencyId",
                table: "ContractAssetDetail",
                column: "PmFrequencyId",
                principalTable: "MasterEntityData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAssetDetail_MasterEntityData_ProductPreAmcConditionId",
                table: "ContractAssetDetail",
                column: "ProductPreAmcConditionId",
                principalTable: "MasterEntityData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAssetDetail_MasterEntityData_ProductSupportTypeDataId",
                table: "ContractAssetDetail",
                column: "ProductSupportTypeDataId",
                principalTable: "MasterEntityData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAssetSummary_MasterEntityData_PCAtBookingId",
                table: "ContractAssetSummary",
                column: "PCAtBookingId",
                principalTable: "MasterEntityData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAssetSummary_MasterEntityData_PMFrequencyId",
                table: "ContractAssetSummary",
                column: "PMFrequencyId",
                principalTable: "MasterEntityData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractDocument_MasterEntityData_ContractDocumentCategoryId",
                table: "ContractDocument",
                column: "ContractDocumentCategoryId",
                principalTable: "MasterEntityData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PurchaseOrder_MasterEntityData_PurchaseOrderStatusId",
                table: "PurchaseOrder",
                column: "PurchaseOrderStatusId",
                principalTable: "MasterEntityData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TenantOffice_MasterEntityData_TenantOfficeTypeId",
                table: "TenantOffice",
                column: "TenantOfficeTypeId",
                principalTable: "MasterEntityData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}