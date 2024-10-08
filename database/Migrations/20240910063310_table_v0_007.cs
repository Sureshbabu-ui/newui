using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class table_v0_007 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApprovalRequest_ApprovalWorkflow_ApprovalWorkflowId",
                table: "ApprovalRequest");

            migrationBuilder.DropForeignKey(
                name: "FK_ApprovalWorkflowDetail_TenantOffice_TenantOfficeId",
                table: "ApprovalWorkflowDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractAssetPmDetail_CustomerSite_CustomerSiteId",
                table: "ContractAssetPmDetail");

            migrationBuilder.DropIndex(
                name: "IX_ContractAssetPmDetail_CustomerSiteId",
                table: "ContractAssetPmDetail");

            migrationBuilder.DropIndex(
                name: "IX_ApprovalWorkflow_Code",
                table: "ApprovalWorkflow");

            migrationBuilder.DropColumn(
                name: "ApprovedBy",
                table: "CustomerInfo");

            migrationBuilder.DropColumn(
                name: "ApprovedOn",
                table: "CustomerInfo");

            migrationBuilder.DropColumn(
                name: "CustomerSiteId",
                table: "ContractAssetPmDetail");

            migrationBuilder.DropColumn(
                name: "PmScheduledDate",
                table: "ContractAssetPmDetail");

            migrationBuilder.DropColumn(
                name: "BudgetLimit",
                table: "ApprovalWorkflowDetail");

            migrationBuilder.DropColumn(
                name: "Code",
                table: "ApprovalWorkflow");

            migrationBuilder.RenameColumn(
                name: "TenantOfficeId",
                table: "ApprovalWorkflowDetail",
                newName: "ApproverUserId");

            migrationBuilder.RenameIndex(
                name: "IX_ApprovalWorkflowDetail_TenantOfficeId",
                table: "ApprovalWorkflowDetail",
                newName: "IX_ApprovalWorkflowDetail_ApproverUserId");

            migrationBuilder.RenameColumn(
                name: "ApprovalWorkflowId",
                table: "ApprovalRequest",
                newName: "ApprovalEventId");

            migrationBuilder.RenameIndex(
                name: "IX_ApprovalRequest_ApprovalWorkflowId",
                table: "ApprovalRequest",
                newName: "IX_ApprovalRequest_ApprovalEventId");

            migrationBuilder.AddColumn<int>(
                name: "UserGradeId",
                table: "UserInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "WorkOrderNumber",
                table: "ServiceRequest",
                type: "varchar(32)",
                maxLength: 32,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CaseId",
                table: "ServiceRequest",
                type: "varchar(32)",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16);

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "ServiceEngineerInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "ServiceEngineerInfo",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedBy",
                table: "ServiceEngineerInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedOn",
                table: "ServiceEngineerInfo",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "ServiceEngineerInfo",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "ServiceEngineerInfo",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedBy",
                table: "ServiceEngineerInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedOn",
                table: "ServiceEngineerInfo",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PoNumber",
                table: "PurchaseOrder",
                type: "varchar(32)",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "PartSubCategory",
                type: "varchar(16)",
                maxLength: 16,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(8)",
                oldMaxLength: 8);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "PartProductCategory",
                type: "varchar(16)",
                maxLength: 16,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(8)",
                oldMaxLength: 8);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "PartCategory",
                type: "varchar(16)",
                maxLength: 16,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(8)",
                oldMaxLength: 8);

            migrationBuilder.AlterColumn<string>(
                name: "PartCode",
                table: "Part",
                type: "varchar(16)",
                maxLength: 16,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(8)",
                oldMaxLength: 8);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Make",
                type: "varchar(16)",
                maxLength: 16,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(8)",
                oldMaxLength: 8);

            migrationBuilder.AddColumn<int>(
                name: "DocumentNumberFormatId",
                table: "DocumentNumberSeries",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RegionId",
                table: "DocumentNumberSeries",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "StateId",
                table: "DocumentNumberSeries",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TenantRegionId",
                table: "DocumentNumberSeries",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Format",
                table: "DocumentNumberFormat",
                type: "varchar(64)",
                maxLength: 64,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(32)",
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<string>(
                name: "DcNumber",
                table: "DeliveryChallan",
                type: "varchar(32)",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16);

            migrationBuilder.AlterColumn<string>(
                name: "ShippedToGstNumber",
                table: "CustomerInfo",
                type: "varchar(16)",
                maxLength: 16,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16);

            migrationBuilder.AlterColumn<string>(
                name: "BilledToGstNumber",
                table: "CustomerInfo",
                type: "varchar(16)",
                maxLength: 16,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16);

            migrationBuilder.AddColumn<int>(
                name: "GstTypeId",
                table: "CustomerInfo",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "CustomerCode",
                table: "Customer",
                type: "varchar(16)",
                maxLength: 16,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(32)",
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Country",
                type: "varchar(64)",
                maxLength: 64,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16);

            migrationBuilder.AddColumn<DateTime>(
                name: "PeriodFrom",
                table: "ContractPmSchedule",
                type: "date",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "PeriodTo",
                table: "ContractPmSchedule",
                type: "date",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "AssetProductCategory",
                type: "varchar(16)",
                maxLength: 16,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(8)",
                oldMaxLength: 8);

            migrationBuilder.AlterColumn<int>(
                name: "ApproverRoleId",
                table: "ApprovalWorkflowDetail",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "ApprovalWorkflow",
                type: "varchar(16)",
                maxLength: 16,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(64)",
                oldMaxLength: 64);

            migrationBuilder.AlterColumn<int>(
                name: "RoleId",
                table: "ApprovalRequestDetail",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "ApproverUserId",
                table: "ApprovalRequestDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EventConditionId",
                table: "ApprovalRequest",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ContractFutureUpdate",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ContractId = table.Column<int>(type: "int", nullable: false),
                    SerialNumber = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: false),
                    TargetDate = table.Column<DateTime>(type: "date", nullable: true),
                    ProbabilityPercentage = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    RenewedMergedContractNumber = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: true),
                    StatusId = table.Column<int>(type: "int", nullable: false),
                    SubStatusId = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "datetime", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedOn = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractFutureUpdate", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContractFutureUpdate_Contract_ContractId",
                        column: x => x.ContractId,
                        principalTable: "Contract",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "EventGroup",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EventGroupName = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventGroup", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ApprovalEvent",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EventGroupId = table.Column<int>(type: "int", nullable: false),
                    EventCode = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: false),
                    EventName = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApprovalEvent", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ApprovalEvent_EventGroup_EventGroupId",
                        column: x => x.EventGroupId,
                        principalTable: "EventGroup",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "EventCondition",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ApprovalWorkflowId = table.Column<int>(type: "int", nullable: false),
                    ApprovalEventId = table.Column<int>(type: "int", nullable: false),
                    ConditionName = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    ConditionValue = table.Column<string>(type: "varchar(2048)", maxLength: 2048, nullable: true),
                    Sequence = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventCondition", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventCondition_ApprovalEvent_ApprovalEventId",
                        column: x => x.ApprovalEventId,
                        principalTable: "ApprovalEvent",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EventCondition_ApprovalWorkflow_ApprovalWorkflowId",
                        column: x => x.ApprovalWorkflowId,
                        principalTable: "ApprovalWorkflow",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "EventConditionMasterTable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ApprovalEventId = table.Column<int>(type: "int", nullable: false),
                    TableName = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    DisplayName = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    Sequence = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventConditionMasterTable", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventConditionMasterTable_ApprovalEvent_ApprovalEventId",
                        column: x => x.ApprovalEventId,
                        principalTable: "ApprovalEvent",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "EventConditionMasterColumn",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EventConditionMasterTableId = table.Column<int>(type: "int", nullable: false),
                    ColumnName = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    DisplayName = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    ValueType = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    Sequence = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventConditionMasterColumn", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventConditionMasterColumn_EventConditionMasterTable_EventConditionMasterTableId",
                        column: x => x.EventConditionMasterTableId,
                        principalTable: "EventConditionMasterTable",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "AppSetting",
                columns: new[] { "Id", "AppKey", "AppValue", "CreatedBy", "CreatedOn", "UpdatedBy", "UpdatedOn" },
                values: new object[] { 31, "AppTwoLetterCode", "BS", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null });

            migrationBuilder.InsertData(
                table: "ApprovalWorkflow",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "Description", "IsActive", "ModifiedBy", "ModifiedOn", "Name" },
                values: new object[] { 6, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Configure the multilevel approval system for bank edit to ensure thorough review and authorization at each stage. Customize the approval hierarchy and criteria to match your organizational needs", true, null, null, "Customer Create" });

            migrationBuilder.InsertData(
                table: "BusinessFunction",
                columns: new[] { "Id", "BusinessFunctionCode", "BusinessFunctionName", "BusinessFunctionTypeId", "BusinessModuleId", "CreatedBy", "CreatedOn", "Description", "IsActive", "UpdatedBy", "UpdatedOn" },
                values: new object[,]
                {
                    { 128, "CONTRACT_FUTUREUPDATES_MANAGE", "Manage Contract Future Updates", 275, 1, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 129, "CONTRACT_FUTUREUPDATES_VIEW", "Contract Future Updates View", 275, 1, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 133, "CONTRACT_PMSCHEDULE_VIEW", "Contract PM Schedule", 275, 1, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null }
                });

            migrationBuilder.InsertData(
                table: "BusinessModule",
                columns: new[] { "Id", "BusinessModuleName", "CreatedBy", "CreatedOn", "Description", "IsActive", "UpdatedBy", "UpdatedOn" },
                values: new object[] { 20, "Settings", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Manages the creation and listing of specific settings and its details", true, null, null });

            migrationBuilder.InsertData(
                table: "DocumentNumberFormat",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "DocumentTypeId", "Format", "ModifiedBy", "ModifiedOn", "NumberPadding" },
                values: new object[,]
                {
                    { 10, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 283, "SI-{STATE}{NOSPACE}{YYYY}-{NUM}", null, null, 6 },
                    { 11, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 289, "CTR-{LOC}{NOSPACE}{YYYY}-{NUM}", null, null, 5 },
                    { 20, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 284, "RCPT-{LOC}{NOSPACE}{YYYY}-{NUM}", null, null, 5 }
                });

            migrationBuilder.InsertData(
                table: "EventGroup",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "EventGroupName", "IsActive", "UpdatedBy", "UpdatedOn" },
                values: new object[,]
                {
                    { 1, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Bank", true, null, null },
                    { 2, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Contract", true, null, null },
                    { 3, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Customer", true, null, null },
                    { 4, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Part", true, null, null },
                    { 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "User", true, null, null }
                });

            migrationBuilder.InsertData(
                table: "MasterEntity",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "Description", "EntityType" },
                values: new object[,]
                {
                    { 65, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Contract Future Update Status", "ContractFutureUpdateStatus" },
                    { 66, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Contract Future Update Sub Status", "ContractFutureUpdateSubStatus" },
                    { 67, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "User grades", "UserGrade" },
                    { 68, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Customer Gst Type List", "GSTType" }
                });

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 289,
                columns: new[] { "Code", "MasterEntityId", "Name" },
                values: new object[] { "DCT_CNTR", 63, "Contract" });

            migrationBuilder.InsertData(
                table: "MasterEntityData",
                columns: new[] { "Id", "Code", "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "MasterEntityId", "ModifiedBy", "ModifiedOn", "Name" },
                values: new object[,]
                {
                    { 290, "DCT_CUST", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Customer" },
                    { 291, "DCT_VNDR", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Vendor" },
                    { 292, "PPC_NFND", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 32, null, null, "Not Found" },
                    { 294, "DCT_APC", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Asset product category code" },
                    { 295, "DCT_MKE", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Make code" },
                    { 296, "DCT_PPC", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Part product category code" },
                    { 297, "DCT_PC", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Part code" },
                    { 298, "DCT_PCC", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Part category code" },
                    { 299, "DCT_PSC", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Part sub category code" },
                    { 300, "DCT_PM", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Product model code" },
                    { 301, "DCT_DC", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Delivery chellan number" },
                    { 302, "DCT_CID", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Case ID" },
                    { 303, "DCT_GIN", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Goods issued received note" },
                    { 304, "DCT_PO", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Purchase order number" },
                    { 305, "DCT_GRN", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Goods received note" },
                    { 306, "DCT_PIN", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Part indent number" },
                    { 307, "DCT_WON", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Work order number" },
                    { 308, "DCT_DND", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Demand number" },
                    { 344, "DCT_PMSN", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Pm Schedule Number" }
                });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1001,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1002,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1003,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1005,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1006,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1007,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1008,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1009,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1010,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1011,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1012,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1013,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1014,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1015,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1016,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1017,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1018,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1019,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1020,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1021,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1024,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1025,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1026,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1027,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1028,
                columns: new[] { "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null, null, null, false, false, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 8,
                column: "UserGradeId",
                value: 336);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 10,
                column: "UserGradeId",
                value: 335);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 11,
                column: "UserGradeId",
                value: 336);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 12,
                column: "UserGradeId",
                value: 336);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 15,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 16,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 18,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 19,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 23,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 24,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 25,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 26,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 27,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 28,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 29,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 30,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 31,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 32,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 33,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 34,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 35,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 36,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 37,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 38,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 39,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 40,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 41,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 42,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 43,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 44,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 45,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 46,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 47,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 48,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 1001,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 1002,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 12638,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13048,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13118,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13242,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13273,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13274,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13372,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13490,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13969,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14027,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14028,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14029,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14030,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14168,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14173,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14174,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14276,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14327,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14381,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14502,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 20001,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 20002,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 20003,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 90270,
                column: "UserGradeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 90391,
                column: "UserGradeId",
                value: null);

            migrationBuilder.InsertData(
                table: "ApprovalEvent",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "EventCode", "EventGroupId", "EventName", "IsActive", "UpdatedBy", "UpdatedOn" },
                values: new object[,]
                {
                    { 1, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "AE_BANK_CREATE", 1, "Bank Create", true, null, null },
                    { 2, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "AE_BANK_EDIT", 1, "Bank Edit", true, null, null },
                    { 3, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "AE_CONTRACT_CREATE", 2, "Contract Create", true, null, null },
                    { 4, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "AE_CONTRACT_EDIT", 2, "Contract Edit", true, null, null },
                    { 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "AE_CUSTOMER_CREATE", 3, "Customer Create", true, null, null },
                    { 6, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "AE_CUSTOMER_EDIT", 3, "Customer Edit", true, null, null },
                    { 7, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "AE_PART_CREATE", 4, "Part Create", true, null, null },
                    { 8, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "AE_PART_EDIT", 4, "Part Edit", true, null, null },
                    { 9, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "AE_USER_CREATE", 5, "User Create", true, null, null },
                    { 10, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "AE_USER_EDIT", 5, "User Edit", true, null, null }
                });

            migrationBuilder.InsertData(
                table: "BusinessFunction",
                columns: new[] { "Id", "BusinessFunctionCode", "BusinessFunctionName", "BusinessFunctionTypeId", "BusinessModuleId", "CreatedBy", "CreatedOn", "Description", "IsActive", "UpdatedBy", "UpdatedOn" },
                values: new object[,]
                {
                    { 130, "DOCUMENTNUMBERSERIES_VIEW", "View Document Number Series", 275, 20, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 131, "DOCUMENTNUMBERFORMAT_MANAGE", "Manage Document Number Format", 275, 20, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 132, "DOCUMENTNUMBERFORMAT_VIEW", "View Document Number Format", 275, 20, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null }
                });

            migrationBuilder.InsertData(
                table: "DocumentNumberFormat",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "DocumentTypeId", "Format", "ModifiedBy", "ModifiedOn", "NumberPadding" },
                values: new object[,]
                {
                    { 1, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 290, "CUST-{APPCODE}-{NUM}", null, null, 8 },
                    { 2, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 294, "APC-{NUM}", null, null, 8 },
                    { 3, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 295, "MC-{NUM}", null, null, 8 },
                    { 4, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 296, "PPC-{NUM}", null, null, 8 },
                    { 5, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 297, "PC-{NUM}", null, null, 8 },
                    { 6, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 298, "PCC-{NUM}", null, null, 8 },
                    { 7, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 299, "PSC-{NUM}", null, null, 8 },
                    { 8, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 300, "PM-{NUM}", null, null, 8 },
                    { 9, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 291, "VEND-{APPCODE}-{NUM}", null, null, 8 },
                    { 12, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 301, "DC-{LOC}-{YYYY}-{NUM}", null, null, 5 },
                    { 13, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 302, "CID-{LOC}-{YYYY}-{NUM}", null, null, 5 },
                    { 14, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 303, "GIN-{LOC}-{YYYY}-{NUM}", null, null, 6 },
                    { 15, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 304, "PO-{LOC}-{YYYY}-{NUM}", null, null, 6 },
                    { 16, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 305, "GRN-{LOC}-{YYYY}-{NUM}", null, null, 6 },
                    { 17, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 306, "PIN-{LOC}{YYYY}-{NUM}", null, null, 6 },
                    { 18, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 307, "WO-{LOC}-{YYYY}-{NUM}", null, null, 5 },
                    { 19, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 308, "DN{NOSPACE}{LOC}{NOSPACE}{YYYY}-{NUM}", null, null, 6 },
                    { 21, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 344, "PMSN-{LOC}{NOSPACE}{YYYY}-{NUM}", null, null, 4 }
                });

            migrationBuilder.InsertData(
                table: "DocumentNumberSeries",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "DocumentNumberFormatId", "DocumentTypeId", "IsActive", "ModifiedBy", "ModifiedOn", "RegionId", "StateId", "TenantOfficeId", "TenantRegionId", "Year" },
                values: new object[,]
                {
                    { 10, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 1, null, null, "2425" },
                    { 11, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 2, null, null, "2425" },
                    { 12, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 3, null, null, "2425" },
                    { 13, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 4, null, null, "2425" },
                    { 14, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 5, null, null, "2425" },
                    { 15, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 6, null, null, "2425" },
                    { 16, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 7, null, null, "2425" },
                    { 17, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 8, null, null, "2425" },
                    { 18, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 9, null, null, "2425" },
                    { 19, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 10, null, null, "2425" },
                    { 20, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 11, null, null, "2425" },
                    { 21, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 12, null, null, "2425" },
                    { 22, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 13, null, null, "2425" },
                    { 23, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 14, null, null, "2425" },
                    { 24, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 15, null, null, "2425" },
                    { 25, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 16, null, null, "2425" },
                    { 26, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 17, null, null, "2425" },
                    { 27, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 18, null, null, "2425" },
                    { 28, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 19, null, null, "2425" },
                    { 29, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 20, null, null, "2425" },
                    { 30, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 21, null, null, "2425" },
                    { 31, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 22, null, null, "2425" },
                    { 32, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 23, null, null, "2425" },
                    { 33, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 24, null, null, "2425" },
                    { 34, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 25, null, null, "2425" },
                    { 35, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 26, null, null, "2425" },
                    { 36, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 27, null, null, "2425" },
                    { 37, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 28, null, null, "2425" },
                    { 38, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 29, null, null, "2425" },
                    { 39, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 30, null, null, "2425" },
                    { 40, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 31, null, null, "2425" },
                    { 41, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 32, null, null, "2425" },
                    { 42, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 33, null, null, "2425" },
                    { 43, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 34, null, null, "2425" },
                    { 44, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 35, null, null, "2425" },
                    { 45, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 36, null, null, "2425" },
                    { 46, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 10, 283, true, null, null, null, 37, null, null, "2425" },
                    { 47, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 1, null, "2425" },
                    { 48, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 2, null, "2425" },
                    { 49, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 3, null, "2425" },
                    { 50, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 4, null, "2425" },
                    { 51, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 5, null, "2425" },
                    { 52, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 6, null, "2425" },
                    { 53, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 7, null, "2425" },
                    { 54, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 8, null, "2425" },
                    { 55, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 9, null, "2425" },
                    { 56, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 10, null, "2425" },
                    { 57, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 11, null, "2425" },
                    { 58, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 12, null, "2425" },
                    { 59, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 13, null, "2425" },
                    { 60, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 14, null, "2425" },
                    { 61, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 15, null, "2425" },
                    { 62, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 16, null, "2425" },
                    { 63, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 17, null, "2425" },
                    { 64, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 18, null, "2425" },
                    { 65, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 19, null, "2425" },
                    { 66, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 20, null, "2425" },
                    { 67, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 21, null, "2425" },
                    { 68, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 22, null, "2425" },
                    { 69, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 23, null, "2425" },
                    { 70, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 24, null, "2425" },
                    { 71, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 25, null, "2425" },
                    { 72, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 26, null, "2425" },
                    { 73, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 27, null, "2425" },
                    { 74, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 28, null, "2425" },
                    { 75, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 29, null, "2425" },
                    { 76, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 30, null, "2425" },
                    { 77, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 31, null, "2425" },
                    { 78, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 32, null, "2425" },
                    { 79, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 33, null, "2425" },
                    { 80, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 34, null, "2425" },
                    { 81, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 35, null, "2425" },
                    { 82, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 36, null, "2425" },
                    { 83, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 37, null, "2425" },
                    { 84, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 38, null, "2425" },
                    { 85, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 39, null, "2425" },
                    { 86, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 40, null, "2425" },
                    { 87, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 41, null, "2425" },
                    { 88, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 42, null, "2425" },
                    { 89, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 43, null, "2425" },
                    { 90, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 11, 289, true, null, null, null, null, 44, null, "2425" }
                });

            migrationBuilder.InsertData(
                table: "DocumentNumberSeries",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "DocumentNumberFormatId", "DocumentTypeId", "ModifiedBy", "ModifiedOn", "RegionId", "StateId", "TenantOfficeId", "TenantRegionId", "Year" },
                values: new object[,]
                {
                    { 399, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 1, null, "2425" },
                    { 400, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 2, null, "2425" },
                    { 401, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 3, null, "2425" },
                    { 402, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 4, null, "2425" },
                    { 403, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 5, null, "2425" },
                    { 404, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 6, null, "2425" },
                    { 405, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 7, null, "2425" },
                    { 406, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 8, null, "2425" },
                    { 407, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 9, null, "2425" },
                    { 408, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 10, null, "2425" },
                    { 409, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 11, null, "2425" },
                    { 410, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 12, null, "2425" },
                    { 411, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 13, null, "2425" },
                    { 412, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 14, null, "2425" },
                    { 413, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 15, null, "2425" },
                    { 414, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 16, null, "2425" },
                    { 415, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 17, null, "2425" },
                    { 416, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 18, null, "2425" },
                    { 417, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 19, null, "2425" },
                    { 418, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 20, null, "2425" },
                    { 419, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 21, null, "2425" },
                    { 420, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 22, null, "2425" },
                    { 421, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 23, null, "2425" },
                    { 422, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 24, null, "2425" },
                    { 423, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 25, null, "2425" },
                    { 424, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 26, null, "2425" },
                    { 425, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 27, null, "2425" },
                    { 426, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 28, null, "2425" },
                    { 427, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 29, null, "2425" },
                    { 428, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 30, null, "2425" },
                    { 429, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 31, null, "2425" },
                    { 430, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 32, null, "2425" },
                    { 431, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 33, null, "2425" },
                    { 432, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 34, null, "2425" },
                    { 433, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 35, null, "2425" },
                    { 434, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 36, null, "2425" },
                    { 435, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 37, null, "2425" },
                    { 436, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 38, null, "2425" },
                    { 437, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 39, null, "2425" },
                    { 438, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 40, null, "2425" },
                    { 439, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 41, null, "2425" },
                    { 440, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 42, null, "2425" },
                    { 441, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 43, null, "2425" },
                    { 442, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 20, 284, null, null, null, null, 44, null, "2425" }
                });

            migrationBuilder.InsertData(
                table: "MasterEntityData",
                columns: new[] { "Id", "Code", "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "MasterEntityId", "ModifiedBy", "ModifiedOn", "Name" },
                values: new object[,]
                {
                    { 309, "FUS_UPOC", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 65, null, null, "Renewal-Under Process-Order Confirm" },
                    { 310, "FUS_RMRD", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 65, null, null, "Renewal- Merged,Renewal-Dropped" },
                    { 311, "FUS_RNLS", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 65, null, null, "Renewal-Lost" },
                    { 312, "FUS_RUPR", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 65, null, null, "Renewal-Under Process(Risk)" },
                    { 313, "FUS_LACG", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 65, null, null, "Live-Asset Change" },
                    { 314, "FUS_LMPC", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 65, null, null, "Live-Man Power Change" },
                    { 315, "FUS_LCTR", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 65, null, null, "Live-Contract Termination" },
                    { 316, "FSS_AADR", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 66, null, null, "Awaiting Asset Details" },
                    { 317, "FSS_ADRQ", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 66, null, null, "Asset Details Received-Quote to be Submitted" },
                    { 318, "FSS_QSMS", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 66, null, null, "Quote Submitted and Meeting Scheduled" },
                    { 319, "FSS_NFEP", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 66, null, null, "Negotiation Finalised and Expecting PO" },
                    { 320, "FSS_DOPE", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 66, null, null, "Document Pending" },
                    { 321, "FSS_FUPR", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 66, null, null, "Fund Problem" },
                    { 322, "FSS_HICO", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 66, null, null, "High Consumption" },
                    { 323, "FSS_AEOL", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 66, null, null, "Asset End of Life" },
                    { 324, "FSS_ASRE", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 66, null, null, "Asset Removal" },
                    { 325, "FSS_SEIS", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 66, null, null, "Service Issue" },
                    { 326, "FSS_COMP", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 66, null, null, "Competition" },
                    { 327, "FSS_ARIV", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 66, null, null, "Asset Reduction in Value" },
                    { 328, "FSS_AIIV", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 66, null, null, "Asset increase in Value" },
                    { 329, "FSS_MPVD", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 66, null, null, "Man power Value decrease" },
                    { 330, "FSS_MPVI", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 66, null, null, "Man Power Value increase" },
                    { 332, "USR_GP01", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 67, null, null, "P01" },
                    { 333, "USR_GP02", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 67, null, null, "P02" },
                    { 334, "USR_GP03", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 67, null, null, "P03" },
                    { 335, "USR_GP04", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 67, null, null, "P04" },
                    { 336, "USR_GP05", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 67, null, null, "P05" },
                    { 337, "USR_GP06", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 67, null, null, "P06" },
                    { 338, "USR_GP07", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 67, null, null, "P07" },
                    { 339, "USR_GP08", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 67, null, null, "P08" },
                    { 340, "USR_GP09", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 67, null, null, "P09" },
                    { 341, "USR_GP10", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 67, null, null, "P10" },
                    { 342, "GCT_RGST", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 68, null, null, "Registered" },
                    { 343, "GCT_URST", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 68, null, null, "Un Registered" }
                });

            migrationBuilder.InsertData(
                table: "DocumentNumberSeries",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "DocumentNumberFormatId", "DocumentTypeId", "ModifiedBy", "ModifiedOn", "RegionId", "StateId", "TenantOfficeId", "TenantRegionId", "Year" },
                values: new object[,]
                {
                    { 1, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 1, 290, null, null, null, null, null, null, null },
                    { 2, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 2, 294, null, null, null, null, null, null, null },
                    { 3, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 3, 295, null, null, null, null, null, null, null },
                    { 4, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 4, 296, null, null, null, null, null, null, null },
                    { 5, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 5, 297, null, null, null, null, null, null, null },
                    { 6, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 6, 298, null, null, null, null, null, null, null },
                    { 7, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 7, 299, null, null, null, null, null, null, null },
                    { 8, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 8, 300, null, null, null, null, null, null, null },
                    { 9, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 9, 291, null, null, null, null, null, null, null },
                    { 91, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 1, null, "2425" },
                    { 92, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 2, null, "2425" },
                    { 93, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 3, null, "2425" },
                    { 94, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 4, null, "2425" },
                    { 95, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 5, null, "2425" },
                    { 96, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 6, null, "2425" },
                    { 97, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 7, null, "2425" },
                    { 98, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 8, null, "2425" },
                    { 99, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 9, null, "2425" },
                    { 100, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 10, null, "2425" },
                    { 101, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 11, null, "2425" },
                    { 102, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 12, null, "2425" },
                    { 103, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 13, null, "2425" },
                    { 104, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 14, null, "2425" },
                    { 105, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 15, null, "2425" },
                    { 106, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 16, null, "2425" },
                    { 107, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 17, null, "2425" },
                    { 108, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 18, null, "2425" },
                    { 109, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 19, null, "2425" },
                    { 110, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 20, null, "2425" },
                    { 111, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 21, null, "2425" },
                    { 112, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 22, null, "2425" },
                    { 113, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 23, null, "2425" },
                    { 114, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 24, null, "2425" },
                    { 115, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 25, null, "2425" },
                    { 116, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 26, null, "2425" },
                    { 117, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 27, null, "2425" },
                    { 118, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 28, null, "2425" },
                    { 119, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 29, null, "2425" },
                    { 120, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 30, null, "2425" },
                    { 121, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 31, null, "2425" },
                    { 122, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 32, null, "2425" },
                    { 123, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 33, null, "2425" },
                    { 124, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 34, null, "2425" },
                    { 125, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 35, null, "2425" },
                    { 126, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 36, null, "2425" },
                    { 127, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 37, null, "2425" },
                    { 128, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 38, null, "2425" },
                    { 129, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 39, null, "2425" },
                    { 130, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 40, null, "2425" },
                    { 131, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 41, null, "2425" },
                    { 132, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 42, null, "2425" },
                    { 133, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 43, null, "2425" },
                    { 134, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 12, 301, null, null, null, null, 44, null, "2425" },
                    { 135, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 1, null, null },
                    { 136, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 2, null, null },
                    { 137, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 3, null, null },
                    { 138, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 4, null, null },
                    { 139, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 5, null, null },
                    { 140, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 6, null, null },
                    { 141, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 7, null, null },
                    { 142, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 8, null, null },
                    { 143, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 9, null, null },
                    { 144, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 10, null, null },
                    { 145, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 11, null, null },
                    { 146, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 12, null, null },
                    { 147, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 13, null, null },
                    { 148, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 14, null, null },
                    { 149, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 15, null, null },
                    { 150, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 16, null, null },
                    { 151, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 17, null, null },
                    { 152, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 18, null, null },
                    { 153, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 19, null, null },
                    { 154, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 20, null, null },
                    { 155, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 21, null, null },
                    { 156, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 22, null, null },
                    { 157, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 23, null, null },
                    { 158, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 24, null, null },
                    { 159, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 25, null, null },
                    { 160, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 26, null, null },
                    { 161, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 27, null, null },
                    { 162, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 28, null, null },
                    { 163, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 29, null, null },
                    { 164, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 30, null, null },
                    { 165, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 31, null, null },
                    { 166, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 32, null, null },
                    { 167, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 33, null, null },
                    { 168, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 34, null, null },
                    { 169, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 35, null, null },
                    { 170, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 36, null, null },
                    { 171, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 37, null, null },
                    { 172, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 38, null, null },
                    { 173, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 39, null, null },
                    { 174, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 40, null, null },
                    { 175, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 41, null, null },
                    { 176, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 42, null, null },
                    { 177, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 43, null, null },
                    { 178, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 13, 302, null, null, null, null, 44, null, null },
                    { 179, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 1, null, "2425" },
                    { 180, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 2, null, "2425" },
                    { 181, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 3, null, "2425" },
                    { 182, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 4, null, "2425" },
                    { 183, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 5, null, "2425" },
                    { 184, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 6, null, "2425" },
                    { 185, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 7, null, "2425" },
                    { 186, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 8, null, "2425" },
                    { 187, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 9, null, "2425" },
                    { 188, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 10, null, "2425" },
                    { 189, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 11, null, "2425" },
                    { 190, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 12, null, "2425" },
                    { 191, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 13, null, "2425" },
                    { 192, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 14, null, "2425" },
                    { 193, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 15, null, "2425" },
                    { 194, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 16, null, "2425" },
                    { 195, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 17, null, "2425" },
                    { 196, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 18, null, "2425" },
                    { 197, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 19, null, "2425" },
                    { 198, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 20, null, "2425" },
                    { 199, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 21, null, "2425" },
                    { 200, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 22, null, "2425" },
                    { 201, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 23, null, "2425" },
                    { 202, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 24, null, "2425" },
                    { 203, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 25, null, "2425" },
                    { 204, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 26, null, "2425" },
                    { 205, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 27, null, "2425" },
                    { 206, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 28, null, "2425" },
                    { 207, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 29, null, "2425" },
                    { 208, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 30, null, "2425" },
                    { 209, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 31, null, "2425" },
                    { 210, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 32, null, "2425" },
                    { 211, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 33, null, "2425" },
                    { 212, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 34, null, "2425" },
                    { 213, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 35, null, "2425" },
                    { 214, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 36, null, "2425" },
                    { 215, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 37, null, "2425" },
                    { 216, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 38, null, "2425" },
                    { 217, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 39, null, "2425" },
                    { 218, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 40, null, "2425" },
                    { 219, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 41, null, "2425" },
                    { 220, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 42, null, "2425" },
                    { 221, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 43, null, "2425" },
                    { 222, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 14, 303, null, null, null, null, 44, null, "2425" },
                    { 223, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 1, null, "2425" },
                    { 224, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 2, null, "2425" },
                    { 225, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 3, null, "2425" },
                    { 226, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 4, null, "2425" },
                    { 227, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 5, null, "2425" },
                    { 228, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 6, null, "2425" },
                    { 229, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 7, null, "2425" },
                    { 230, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 8, null, "2425" },
                    { 231, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 9, null, "2425" },
                    { 232, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 10, null, "2425" },
                    { 233, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 11, null, "2425" },
                    { 234, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 12, null, "2425" },
                    { 235, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 13, null, "2425" },
                    { 236, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 14, null, "2425" },
                    { 237, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 15, null, "2425" },
                    { 238, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 16, null, "2425" },
                    { 239, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 17, null, "2425" },
                    { 240, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 18, null, "2425" },
                    { 241, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 19, null, "2425" },
                    { 242, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 20, null, "2425" },
                    { 243, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 21, null, "2425" },
                    { 244, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 22, null, "2425" },
                    { 245, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 23, null, "2425" },
                    { 246, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 24, null, "2425" },
                    { 247, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 25, null, "2425" },
                    { 248, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 26, null, "2425" },
                    { 249, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 27, null, "2425" },
                    { 250, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 28, null, "2425" },
                    { 251, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 29, null, "2425" },
                    { 252, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 30, null, "2425" },
                    { 253, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 31, null, "2425" },
                    { 254, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 32, null, "2425" },
                    { 255, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 33, null, "2425" },
                    { 256, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 34, null, "2425" },
                    { 257, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 35, null, "2425" },
                    { 258, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 36, null, "2425" },
                    { 259, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 37, null, "2425" },
                    { 260, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 38, null, "2425" },
                    { 261, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 39, null, "2425" },
                    { 262, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 40, null, "2425" },
                    { 263, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 41, null, "2425" },
                    { 264, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 42, null, "2425" },
                    { 265, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 43, null, "2425" },
                    { 266, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 15, 304, null, null, null, null, 44, null, "2425" },
                    { 267, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 1, null, "2425" },
                    { 268, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 2, null, "2425" },
                    { 269, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 3, null, "2425" },
                    { 270, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 4, null, "2425" },
                    { 271, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 5, null, "2425" },
                    { 272, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 6, null, "2425" },
                    { 273, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 7, null, "2425" },
                    { 274, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 8, null, "2425" },
                    { 275, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 9, null, "2425" },
                    { 276, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 10, null, "2425" },
                    { 277, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 11, null, "2425" },
                    { 278, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 12, null, "2425" },
                    { 279, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 13, null, "2425" },
                    { 280, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 14, null, "2425" },
                    { 281, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 15, null, "2425" },
                    { 282, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 16, null, "2425" },
                    { 283, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 17, null, "2425" },
                    { 284, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 18, null, "2425" },
                    { 285, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 19, null, "2425" },
                    { 286, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 20, null, "2425" },
                    { 287, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 21, null, "2425" },
                    { 288, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 22, null, "2425" },
                    { 289, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 23, null, "2425" },
                    { 290, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 24, null, "2425" },
                    { 291, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 25, null, "2425" },
                    { 292, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 26, null, "2425" },
                    { 293, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 27, null, "2425" },
                    { 294, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 28, null, "2425" },
                    { 295, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 29, null, "2425" },
                    { 296, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 30, null, "2425" },
                    { 297, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 31, null, "2425" },
                    { 298, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 32, null, "2425" },
                    { 299, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 33, null, "2425" },
                    { 300, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 34, null, "2425" },
                    { 301, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 35, null, "2425" },
                    { 302, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 36, null, "2425" },
                    { 303, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 37, null, "2425" },
                    { 304, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 38, null, "2425" },
                    { 305, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 39, null, "2425" },
                    { 306, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 40, null, "2425" },
                    { 307, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 41, null, "2425" },
                    { 308, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 42, null, "2425" },
                    { 309, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 43, null, "2425" },
                    { 310, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 16, 305, null, null, null, null, 44, null, "2425" },
                    { 311, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 1, null, "2425" },
                    { 312, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 2, null, "2425" },
                    { 313, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 3, null, "2425" },
                    { 314, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 4, null, "2425" },
                    { 315, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 5, null, "2425" },
                    { 316, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 6, null, "2425" },
                    { 317, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 7, null, "2425" },
                    { 318, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 8, null, "2425" },
                    { 319, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 9, null, "2425" },
                    { 320, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 10, null, "2425" },
                    { 321, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 11, null, "2425" },
                    { 322, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 12, null, "2425" },
                    { 323, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 13, null, "2425" },
                    { 324, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 14, null, "2425" },
                    { 325, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 15, null, "2425" },
                    { 326, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 16, null, "2425" },
                    { 327, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 17, null, "2425" },
                    { 328, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 18, null, "2425" },
                    { 329, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 19, null, "2425" },
                    { 330, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 20, null, "2425" },
                    { 331, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 21, null, "2425" },
                    { 332, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 22, null, "2425" },
                    { 333, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 23, null, "2425" },
                    { 334, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 24, null, "2425" },
                    { 335, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 25, null, "2425" },
                    { 336, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 26, null, "2425" },
                    { 337, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 27, null, "2425" },
                    { 338, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 28, null, "2425" },
                    { 339, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 29, null, "2425" },
                    { 340, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 30, null, "2425" },
                    { 341, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 31, null, "2425" },
                    { 342, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 32, null, "2425" },
                    { 343, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 33, null, "2425" },
                    { 344, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 34, null, "2425" },
                    { 345, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 35, null, "2425" },
                    { 346, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 36, null, "2425" },
                    { 347, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 37, null, "2425" },
                    { 348, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 38, null, "2425" },
                    { 349, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 39, null, "2425" },
                    { 350, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 40, null, "2425" },
                    { 351, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 41, null, "2425" },
                    { 352, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 42, null, "2425" },
                    { 353, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 43, null, "2425" },
                    { 354, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 17, 306, null, null, null, null, 44, null, "2425" },
                    { 355, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 1, null, "2425" },
                    { 356, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 2, null, "2425" },
                    { 357, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 3, null, "2425" },
                    { 358, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 4, null, "2425" },
                    { 359, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 5, null, "2425" },
                    { 360, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 6, null, "2425" },
                    { 361, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 7, null, "2425" },
                    { 362, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 8, null, "2425" },
                    { 363, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 9, null, "2425" },
                    { 364, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 10, null, "2425" },
                    { 365, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 11, null, "2425" },
                    { 366, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 12, null, "2425" },
                    { 367, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 13, null, "2425" },
                    { 368, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 14, null, "2425" },
                    { 369, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 15, null, "2425" },
                    { 370, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 16, null, "2425" },
                    { 371, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 17, null, "2425" },
                    { 372, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 18, null, "2425" },
                    { 373, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 19, null, "2425" },
                    { 374, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 20, null, "2425" },
                    { 375, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 21, null, "2425" },
                    { 376, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 22, null, "2425" },
                    { 377, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 23, null, "2425" },
                    { 378, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 24, null, "2425" },
                    { 379, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 25, null, "2425" },
                    { 380, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 26, null, "2425" },
                    { 381, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 27, null, "2425" },
                    { 382, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 28, null, "2425" },
                    { 383, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 29, null, "2425" },
                    { 384, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 30, null, "2425" },
                    { 385, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 31, null, "2425" },
                    { 386, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 32, null, "2425" },
                    { 387, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 33, null, "2425" },
                    { 388, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 34, null, "2425" },
                    { 389, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 35, null, "2425" },
                    { 390, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 36, null, "2425" },
                    { 391, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 37, null, "2425" },
                    { 392, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 38, null, "2425" },
                    { 393, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 39, null, "2425" },
                    { 394, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 40, null, "2425" },
                    { 395, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 41, null, "2425" },
                    { 396, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 42, null, "2425" },
                    { 397, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 43, null, "2425" },
                    { 398, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 18, 307, null, null, null, null, 44, null, "2425" },
                    { 443, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 1, null, "2425" },
                    { 444, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 2, null, "2425" },
                    { 445, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 3, null, "2425" },
                    { 446, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 4, null, "2425" },
                    { 447, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 5, null, "2425" },
                    { 448, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 6, null, "2425" },
                    { 449, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 7, null, "2425" },
                    { 450, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 8, null, "2425" },
                    { 451, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 9, null, "2425" },
                    { 452, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 10, null, "2425" },
                    { 453, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 11, null, "2425" },
                    { 454, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 12, null, "2425" },
                    { 455, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 13, null, "2425" },
                    { 456, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 14, null, "2425" },
                    { 457, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 15, null, "2425" },
                    { 458, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 16, null, "2425" },
                    { 459, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 17, null, "2425" },
                    { 460, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 18, null, "2425" },
                    { 461, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 19, null, "2425" },
                    { 462, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 20, null, "2425" },
                    { 463, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 21, null, "2425" },
                    { 464, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 22, null, "2425" },
                    { 465, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 23, null, "2425" },
                    { 466, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 24, null, "2425" },
                    { 467, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 25, null, "2425" },
                    { 468, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 26, null, "2425" },
                    { 469, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 27, null, "2425" },
                    { 470, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 28, null, "2425" },
                    { 471, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 29, null, "2425" },
                    { 472, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 30, null, "2425" },
                    { 473, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 31, null, "2425" },
                    { 474, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 32, null, "2425" },
                    { 475, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 33, null, "2425" },
                    { 476, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 34, null, "2425" },
                    { 477, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 35, null, "2425" },
                    { 478, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 36, null, "2425" },
                    { 479, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 37, null, "2425" },
                    { 480, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 38, null, "2425" },
                    { 481, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 39, null, "2425" },
                    { 482, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 40, null, "2425" },
                    { 483, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 41, null, "2425" },
                    { 484, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 42, null, "2425" },
                    { 485, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 43, null, "2425" },
                    { 486, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 308, null, null, null, null, 44, null, "2425" },
                    { 487, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 1, null, "2425" },
                    { 488, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 2, null, "2425" },
                    { 489, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 3, null, "2425" },
                    { 490, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 4, null, "2425" },
                    { 491, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 5, null, "2425" },
                    { 492, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 6, null, "2425" },
                    { 493, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 7, null, "2425" },
                    { 494, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 8, null, "2425" },
                    { 495, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 9, null, "2425" },
                    { 496, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 10, null, "2425" },
                    { 497, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 11, null, "2425" },
                    { 498, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 12, null, "2425" },
                    { 499, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 13, null, "2425" },
                    { 500, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 14, null, "2425" },
                    { 501, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 15, null, "2425" },
                    { 502, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 16, null, "2425" },
                    { 503, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 17, null, "2425" },
                    { 504, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 18, null, "2425" },
                    { 505, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 19, null, "2425" },
                    { 506, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 20, null, "2425" },
                    { 507, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 21, null, "2425" },
                    { 508, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 22, null, "2425" },
                    { 509, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 23, null, "2425" },
                    { 510, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 24, null, "2425" },
                    { 511, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 25, null, "2425" },
                    { 512, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 26, null, "2425" },
                    { 513, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 27, null, "2425" },
                    { 514, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 28, null, "2425" },
                    { 515, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 29, null, "2425" },
                    { 516, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 30, null, "2425" },
                    { 517, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 31, null, "2425" },
                    { 518, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 32, null, "2425" },
                    { 519, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 33, null, "2425" },
                    { 520, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 34, null, "2425" },
                    { 521, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 35, null, "2425" },
                    { 522, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 36, null, "2425" },
                    { 523, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 37, null, "2425" },
                    { 524, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 38, null, "2425" },
                    { 525, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 39, null, "2425" },
                    { 526, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 40, null, "2425" },
                    { 527, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 41, null, "2425" },
                    { 528, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 42, null, "2425" },
                    { 529, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 43, null, "2425" },
                    { 530, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 19, 302, null, null, null, null, 44, null, "2425" },
                    { 531, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 1, null, "2425" },
                    { 532, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 2, null, "2425" },
                    { 533, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 3, null, "2425" },
                    { 534, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 4, null, "2425" },
                    { 535, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 5, null, "2425" },
                    { 536, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 6, null, "2425" },
                    { 537, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 7, null, "2425" },
                    { 538, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 8, null, "2425" },
                    { 539, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 9, null, "2425" },
                    { 540, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 10, null, "2425" },
                    { 541, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 11, null, "2425" },
                    { 542, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 12, null, "2425" },
                    { 543, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 13, null, "2425" },
                    { 544, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 14, null, "2425" },
                    { 545, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 15, null, "2425" },
                    { 546, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 16, null, "2425" },
                    { 547, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 17, null, "2425" },
                    { 548, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 18, null, "2425" },
                    { 549, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 19, null, "2425" },
                    { 550, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 20, null, "2425" },
                    { 551, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 21, null, "2425" },
                    { 552, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 22, null, "2425" },
                    { 553, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 23, null, "2425" },
                    { 554, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 24, null, "2425" },
                    { 555, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 25, null, "2425" },
                    { 556, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 26, null, "2425" },
                    { 557, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 27, null, "2425" },
                    { 558, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 28, null, "2425" },
                    { 559, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 29, null, "2425" },
                    { 560, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 30, null, "2425" },
                    { 561, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 31, null, "2425" },
                    { 562, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 32, null, "2425" },
                    { 563, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 33, null, "2425" },
                    { 564, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 34, null, "2425" },
                    { 565, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 35, null, "2425" },
                    { 566, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 36, null, "2425" },
                    { 567, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 37, null, "2425" },
                    { 568, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 38, null, "2425" },
                    { 569, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 39, null, "2425" },
                    { 570, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 40, null, "2425" },
                    { 571, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 41, null, "2425" },
                    { 572, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 42, null, "2425" },
                    { 573, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 43, null, "2425" },
                    { 574, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 21, 344, null, null, null, null, 44, null, "2425" }
                });

            migrationBuilder.InsertData(
                table: "EventConditionMasterTable",
                columns: new[] { "Id", "ApprovalEventId", "CreatedBy", "CreatedOn", "DisplayName", "IsActive", "Sequence", "TableName", "UpdatedBy", "UpdatedOn" },
                values: new object[,]
                {
                    { 1, 3, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Contract", true, 1, "Contract", null, null },
                    { 2, 4, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Contract", true, 1, "Contract", null, null },
                    { 3, 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Customer", true, 1, "CustomerInfo", null, null },
                    { 4, 6, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Customer", true, 1, "CustomerInfo", null, null },
                    { 5, 7, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Part", true, 1, "Part", null, null },
                    { 6, 8, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Part", true, 1, "Part", null, null },
                    { 7, 9, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "User Info", true, 1, "UserInfo", null, null },
                    { 8, 9, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "User Role", true, 2, "UserRole", null, null },
                    { 9, 10, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "User Info", true, 1, "UserInfo", null, null },
                    { 10, 10, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "User Role", true, 2, "UserRole", null, null }
                });

            migrationBuilder.InsertData(
                table: "EventConditionMasterColumn",
                columns: new[] { "Id", "ColumnName", "CreatedBy", "CreatedOn", "DisplayName", "EventConditionMasterTableId", "IsActive", "Sequence", "UpdatedBy", "UpdatedOn", "ValueType" },
                values: new object[,]
                {
                    { 1, "AgreementTypeId", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Agreement Type", 1, true, 1, null, null, "SELECT" },
                    { 2, "ContractValue", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Contract Value", 1, true, 2, null, null, "NUMBER" },
                    { 3, "DesignationId", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Designation", 7, true, 1, null, null, "SELECT" },
                    { 4, "DivisionId", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Division", 7, true, 2, null, null, "SELECT" },
                    { 5, "TenantOfficeId", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Office", 7, true, 1, null, null, "SELECT" },
                    { 6, "DepartmentId", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Department", 7, true, 1, null, null, "SELECT" },
                    { 7, "TenantOfficeId", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Office", 3, true, 1, null, null, "SELECT" },
                    { 8, "TenantOfficeId", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Office", 4, true, 1, null, null, "SELECT" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserInfo_UserGradeId",
                table: "UserInfo",
                column: "UserGradeId");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentNumberSeries_DocumentNumberFormatId",
                table: "DocumentNumberSeries",
                column: "DocumentNumberFormatId");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentNumberSeries_StateId",
                table: "DocumentNumberSeries",
                column: "StateId");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentNumberSeries_TenantRegionId",
                table: "DocumentNumberSeries",
                column: "TenantRegionId");

            migrationBuilder.CreateIndex(
                name: "IX_ApprovalRequestDetail_ApproverUserId",
                table: "ApprovalRequestDetail",
                column: "ApproverUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ApprovalRequest_EventConditionId",
                table: "ApprovalRequest",
                column: "EventConditionId");

            migrationBuilder.CreateIndex(
                name: "IX_ApprovalEvent_EventCode",
                table: "ApprovalEvent",
                column: "EventCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ApprovalEvent_EventGroupId",
                table: "ApprovalEvent",
                column: "EventGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_ApprovalEvent_EventName",
                table: "ApprovalEvent",
                column: "EventName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ContractFutureUpdate_ContractId",
                table: "ContractFutureUpdate",
                column: "ContractId");

            migrationBuilder.CreateIndex(
                name: "IX_EventCondition_ApprovalEventId_Sequence",
                table: "EventCondition",
                columns: new[] { "ApprovalEventId", "Sequence" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EventCondition_ApprovalWorkflowId",
                table: "EventCondition",
                column: "ApprovalWorkflowId");

            migrationBuilder.CreateIndex(
                name: "IX_EventConditionMasterColumn_EventConditionMasterTableId",
                table: "EventConditionMasterColumn",
                column: "EventConditionMasterTableId");

            migrationBuilder.CreateIndex(
                name: "IX_EventConditionMasterTable_ApprovalEventId",
                table: "EventConditionMasterTable",
                column: "ApprovalEventId");

            migrationBuilder.AddForeignKey(
                name: "FK_ApprovalRequest_ApprovalEvent_ApprovalEventId",
                table: "ApprovalRequest",
                column: "ApprovalEventId",
                principalTable: "ApprovalEvent",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ApprovalRequest_EventCondition_EventConditionId",
                table: "ApprovalRequest",
                column: "EventConditionId",
                principalTable: "EventCondition",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ApprovalRequestDetail_UserInfo_ApproverUserId",
                table: "ApprovalRequestDetail",
                column: "ApproverUserId",
                principalTable: "UserInfo",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ApprovalWorkflowDetail_UserInfo_ApproverUserId",
                table: "ApprovalWorkflowDetail",
                column: "ApproverUserId",
                principalTable: "UserInfo",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DocumentNumberSeries_DocumentNumberFormat_DocumentNumberFormatId",
                table: "DocumentNumberSeries",
                column: "DocumentNumberFormatId",
                principalTable: "DocumentNumberFormat",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DocumentNumberSeries_State_StateId",
                table: "DocumentNumberSeries",
                column: "StateId",
                principalTable: "State",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DocumentNumberSeries_TenantRegion_TenantRegionId",
                table: "DocumentNumberSeries",
                column: "TenantRegionId",
                principalTable: "TenantRegion",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserInfo_MasterEntityData_UserGradeId",
                table: "UserInfo",
                column: "UserGradeId",
                principalTable: "MasterEntityData",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApprovalRequest_ApprovalEvent_ApprovalEventId",
                table: "ApprovalRequest");

            migrationBuilder.DropForeignKey(
                name: "FK_ApprovalRequest_EventCondition_EventConditionId",
                table: "ApprovalRequest");

            migrationBuilder.DropForeignKey(
                name: "FK_ApprovalRequestDetail_UserInfo_ApproverUserId",
                table: "ApprovalRequestDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_ApprovalWorkflowDetail_UserInfo_ApproverUserId",
                table: "ApprovalWorkflowDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_DocumentNumberSeries_DocumentNumberFormat_DocumentNumberFormatId",
                table: "DocumentNumberSeries");

            migrationBuilder.DropForeignKey(
                name: "FK_DocumentNumberSeries_State_StateId",
                table: "DocumentNumberSeries");

            migrationBuilder.DropForeignKey(
                name: "FK_DocumentNumberSeries_TenantRegion_TenantRegionId",
                table: "DocumentNumberSeries");

            migrationBuilder.DropForeignKey(
                name: "FK_UserInfo_MasterEntityData_UserGradeId",
                table: "UserInfo");

            migrationBuilder.DropTable(
                name: "ContractFutureUpdate");

            migrationBuilder.DropTable(
                name: "EventCondition");

            migrationBuilder.DropTable(
                name: "EventConditionMasterColumn");

            migrationBuilder.DropTable(
                name: "EventConditionMasterTable");

            migrationBuilder.DropTable(
                name: "ApprovalEvent");

            migrationBuilder.DropTable(
                name: "EventGroup");

            migrationBuilder.DropIndex(
                name: "IX_UserInfo_UserGradeId",
                table: "UserInfo");

            migrationBuilder.DropIndex(
                name: "IX_DocumentNumberSeries_DocumentNumberFormatId",
                table: "DocumentNumberSeries");

            migrationBuilder.DropIndex(
                name: "IX_DocumentNumberSeries_StateId",
                table: "DocumentNumberSeries");

            migrationBuilder.DropIndex(
                name: "IX_DocumentNumberSeries_TenantRegionId",
                table: "DocumentNumberSeries");

            migrationBuilder.DropIndex(
                name: "IX_ApprovalRequestDetail_ApproverUserId",
                table: "ApprovalRequestDetail");

            migrationBuilder.DropIndex(
                name: "IX_ApprovalRequest_EventConditionId",
                table: "ApprovalRequest");

            migrationBuilder.DeleteData(
                table: "AppSetting",
                keyColumn: "Id",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "ApprovalWorkflow",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 128);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 129);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 130);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 131);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 132);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 133);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 32);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 33);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 34);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 35);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 36);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 37);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 38);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 39);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 40);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 41);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 42);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 43);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 44);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 45);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 46);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 47);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 48);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 49);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 50);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 51);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 52);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 53);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 54);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 55);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 56);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 57);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 58);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 59);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 60);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 61);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 62);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 63);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 64);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 65);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 66);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 67);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 68);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 69);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 70);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 71);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 72);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 73);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 74);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 75);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 76);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 77);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 78);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 79);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 80);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 81);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 82);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 83);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 84);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 85);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 86);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 87);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 88);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 89);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 90);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 91);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 92);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 93);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 94);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 95);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 96);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 97);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 98);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 99);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 100);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 101);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 102);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 103);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 104);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 105);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 106);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 107);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 108);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 109);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 110);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 111);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 112);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 113);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 114);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 115);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 116);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 117);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 118);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 119);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 120);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 121);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 122);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 123);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 124);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 125);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 126);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 127);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 128);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 129);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 130);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 131);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 132);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 133);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 134);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 135);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 136);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 137);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 138);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 139);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 140);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 141);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 142);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 143);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 144);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 145);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 146);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 147);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 148);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 149);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 150);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 151);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 152);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 153);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 154);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 155);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 156);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 157);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 158);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 159);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 160);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 161);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 162);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 163);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 164);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 165);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 166);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 167);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 168);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 169);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 170);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 171);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 172);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 173);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 174);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 175);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 176);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 177);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 178);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 179);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 180);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 181);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 182);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 183);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 184);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 185);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 186);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 187);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 188);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 189);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 190);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 191);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 192);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 193);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 194);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 195);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 196);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 197);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 198);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 199);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 200);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 201);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 202);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 203);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 204);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 205);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 206);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 207);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 208);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 209);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 210);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 211);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 212);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 213);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 214);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 215);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 216);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 217);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 218);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 219);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 220);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 221);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 222);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 223);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 224);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 225);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 226);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 227);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 228);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 229);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 230);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 231);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 232);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 233);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 234);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 235);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 236);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 237);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 238);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 239);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 240);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 241);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 242);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 243);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 244);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 245);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 246);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 247);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 248);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 249);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 250);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 251);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 252);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 253);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 254);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 255);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 256);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 257);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 258);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 259);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 260);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 261);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 262);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 263);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 264);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 265);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 266);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 267);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 268);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 269);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 270);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 271);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 272);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 273);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 274);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 275);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 276);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 277);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 278);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 279);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 280);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 281);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 282);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 283);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 284);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 285);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 286);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 287);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 288);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 289);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 290);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 291);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 292);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 293);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 294);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 295);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 296);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 297);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 298);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 299);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 300);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 301);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 302);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 303);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 304);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 305);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 306);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 307);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 308);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 309);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 310);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 311);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 312);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 313);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 314);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 315);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 316);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 317);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 318);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 319);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 320);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 321);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 322);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 323);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 324);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 325);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 326);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 327);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 328);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 329);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 330);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 331);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 332);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 333);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 334);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 335);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 336);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 337);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 338);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 339);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 340);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 341);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 342);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 343);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 344);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 345);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 346);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 347);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 348);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 349);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 350);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 351);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 352);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 353);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 354);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 355);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 356);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 357);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 358);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 359);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 360);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 361);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 362);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 363);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 364);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 365);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 366);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 367);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 368);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 369);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 370);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 371);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 372);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 373);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 374);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 375);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 376);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 377);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 378);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 379);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 380);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 381);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 382);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 383);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 384);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 385);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 386);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 387);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 388);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 389);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 390);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 391);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 392);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 393);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 394);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 395);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 396);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 397);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 398);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 399);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 400);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 401);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 402);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 403);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 404);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 405);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 406);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 407);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 408);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 409);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 410);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 411);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 412);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 413);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 414);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 415);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 416);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 417);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 418);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 419);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 420);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 421);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 422);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 423);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 424);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 425);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 426);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 427);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 428);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 429);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 430);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 431);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 432);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 433);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 434);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 435);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 436);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 437);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 438);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 439);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 440);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 441);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 442);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 443);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 444);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 445);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 446);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 447);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 448);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 449);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 450);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 451);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 452);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 453);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 454);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 455);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 456);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 457);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 458);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 459);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 460);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 461);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 462);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 463);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 464);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 465);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 466);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 467);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 468);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 469);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 470);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 471);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 472);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 473);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 474);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 475);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 476);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 477);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 478);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 479);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 480);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 481);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 482);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 483);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 484);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 485);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 486);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 487);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 488);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 489);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 490);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 491);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 492);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 493);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 494);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 495);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 496);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 497);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 498);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 499);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 500);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 501);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 502);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 503);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 504);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 505);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 506);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 507);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 508);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 509);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 510);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 511);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 512);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 513);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 514);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 515);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 516);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 517);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 518);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 519);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 520);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 521);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 522);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 523);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 524);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 525);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 526);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 527);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 528);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 529);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 530);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 531);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 532);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 533);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 534);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 535);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 536);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 537);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 538);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 539);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 540);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 541);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 542);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 543);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 544);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 545);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 546);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 547);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 548);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 549);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 550);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 551);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 552);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 553);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 554);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 555);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 556);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 557);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 558);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 559);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 560);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 561);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 562);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 563);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 564);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 565);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 566);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 567);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 568);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 569);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 570);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 571);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 572);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 573);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 574);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 292);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 309);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 310);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 311);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 312);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 313);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 314);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 315);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 316);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 317);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 318);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 319);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 320);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 321);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 322);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 323);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 324);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 325);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 326);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 327);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 328);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 329);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 330);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 332);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 333);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 334);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 335);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 336);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 337);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 338);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 339);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 340);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 341);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 342);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 343);

            migrationBuilder.DeleteData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "MasterEntity",
                keyColumn: "Id",
                keyValue: 65);

            migrationBuilder.DeleteData(
                table: "MasterEntity",
                keyColumn: "Id",
                keyValue: 66);

            migrationBuilder.DeleteData(
                table: "MasterEntity",
                keyColumn: "Id",
                keyValue: 67);

            migrationBuilder.DeleteData(
                table: "MasterEntity",
                keyColumn: "Id",
                keyValue: 68);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 290);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 291);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 294);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 295);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 296);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 297);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 298);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 299);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 300);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 301);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 302);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 303);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 304);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 305);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 306);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 307);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 308);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 344);

            migrationBuilder.DropColumn(
                name: "UserGradeId",
                table: "UserInfo");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "ServiceEngineerInfo");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "ServiceEngineerInfo");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "ServiceEngineerInfo");

            migrationBuilder.DropColumn(
                name: "DeletedOn",
                table: "ServiceEngineerInfo");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "ServiceEngineerInfo");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "ServiceEngineerInfo");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "ServiceEngineerInfo");

            migrationBuilder.DropColumn(
                name: "UpdatedOn",
                table: "ServiceEngineerInfo");

            migrationBuilder.DropColumn(
                name: "DocumentNumberFormatId",
                table: "DocumentNumberSeries");

            migrationBuilder.DropColumn(
                name: "RegionId",
                table: "DocumentNumberSeries");

            migrationBuilder.DropColumn(
                name: "StateId",
                table: "DocumentNumberSeries");

            migrationBuilder.DropColumn(
                name: "TenantRegionId",
                table: "DocumentNumberSeries");

            migrationBuilder.DropColumn(
                name: "GstTypeId",
                table: "CustomerInfo");

            migrationBuilder.DropColumn(
                name: "PeriodFrom",
                table: "ContractPmSchedule");

            migrationBuilder.DropColumn(
                name: "PeriodTo",
                table: "ContractPmSchedule");

            migrationBuilder.DropColumn(
                name: "ApproverUserId",
                table: "ApprovalRequestDetail");

            migrationBuilder.DropColumn(
                name: "EventConditionId",
                table: "ApprovalRequest");

            migrationBuilder.RenameColumn(
                name: "ApproverUserId",
                table: "ApprovalWorkflowDetail",
                newName: "TenantOfficeId");

            migrationBuilder.RenameIndex(
                name: "IX_ApprovalWorkflowDetail_ApproverUserId",
                table: "ApprovalWorkflowDetail",
                newName: "IX_ApprovalWorkflowDetail_TenantOfficeId");

            migrationBuilder.RenameColumn(
                name: "ApprovalEventId",
                table: "ApprovalRequest",
                newName: "ApprovalWorkflowId");

            migrationBuilder.RenameIndex(
                name: "IX_ApprovalRequest_ApprovalEventId",
                table: "ApprovalRequest",
                newName: "IX_ApprovalRequest_ApprovalWorkflowId");

            migrationBuilder.AlterColumn<string>(
                name: "WorkOrderNumber",
                table: "ServiceRequest",
                type: "varchar(16)",
                maxLength: 16,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(32)",
                oldMaxLength: 32,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CaseId",
                table: "ServiceRequest",
                type: "varchar(16)",
                maxLength: 16,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(32)",
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<string>(
                name: "PoNumber",
                table: "PurchaseOrder",
                type: "varchar(16)",
                maxLength: 16,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(32)",
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "PartSubCategory",
                type: "varchar(8)",
                maxLength: 8,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "PartProductCategory",
                type: "varchar(8)",
                maxLength: 8,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "PartCategory",
                type: "varchar(8)",
                maxLength: 8,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16);

            migrationBuilder.AlterColumn<string>(
                name: "PartCode",
                table: "Part",
                type: "varchar(8)",
                maxLength: 8,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Make",
                type: "varchar(8)",
                maxLength: 8,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16);

            migrationBuilder.AlterColumn<string>(
                name: "Format",
                table: "DocumentNumberFormat",
                type: "varchar(32)",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(64)",
                oldMaxLength: 64);

            migrationBuilder.AlterColumn<string>(
                name: "DcNumber",
                table: "DeliveryChallan",
                type: "varchar(16)",
                maxLength: 16,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(32)",
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<string>(
                name: "ShippedToGstNumber",
                table: "CustomerInfo",
                type: "varchar(16)",
                maxLength: 16,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "BilledToGstNumber",
                table: "CustomerInfo",
                type: "varchar(16)",
                maxLength: 16,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16,
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ApprovedBy",
                table: "CustomerInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ApprovedOn",
                table: "CustomerInfo",
                type: "datetime",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CustomerCode",
                table: "Customer",
                type: "varchar(32)",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Country",
                type: "varchar(16)",
                maxLength: 16,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(64)",
                oldMaxLength: 64);

            migrationBuilder.AddColumn<int>(
                name: "CustomerSiteId",
                table: "ContractAssetPmDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PmScheduledDate",
                table: "ContractAssetPmDetail",
                type: "date",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "AssetProductCategory",
                type: "varchar(8)",
                maxLength: 8,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16);

            migrationBuilder.AlterColumn<int>(
                name: "ApproverRoleId",
                table: "ApprovalWorkflowDetail",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "BudgetLimit",
                table: "ApprovalWorkflowDetail",
                type: "decimal(16,2)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "ApprovalWorkflow",
                type: "varchar(64)",
                maxLength: 64,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16);

            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "ApprovalWorkflow",
                type: "varchar(16)",
                maxLength: 16,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "RoleId",
                table: "ApprovalRequestDetail",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "ApprovalWorkflow",
                keyColumn: "Id",
                keyValue: 1,
                column: "Code",
                value: "AWF_USER_CREATE");

            migrationBuilder.UpdateData(
                table: "ApprovalWorkflow",
                keyColumn: "Id",
                keyValue: 2,
                column: "Code",
                value: "AWF_USER_EDIT");

            migrationBuilder.UpdateData(
                table: "ApprovalWorkflow",
                keyColumn: "Id",
                keyValue: 3,
                column: "Code",
                value: "AWF_PART_CREATE");

            migrationBuilder.UpdateData(
                table: "ApprovalWorkflow",
                keyColumn: "Id",
                keyValue: 4,
                column: "Code",
                value: "AFW_BANK_CREATE");

            migrationBuilder.UpdateData(
                table: "ApprovalWorkflow",
                keyColumn: "Id",
                keyValue: 5,
                column: "Code",
                value: "AFW_BANK_UPDATE");

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 289,
                columns: new[] { "Code", "MasterEntityId", "Name" },
                values: new object[] { "PPC_NFND", 32, "Not Found" });

            migrationBuilder.CreateIndex(
                name: "IX_ContractAssetPmDetail_CustomerSiteId",
                table: "ContractAssetPmDetail",
                column: "CustomerSiteId");

            migrationBuilder.CreateIndex(
                name: "IX_ApprovalWorkflow_Code",
                table: "ApprovalWorkflow",
                column: "Code",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ApprovalRequest_ApprovalWorkflow_ApprovalWorkflowId",
                table: "ApprovalRequest",
                column: "ApprovalWorkflowId",
                principalTable: "ApprovalWorkflow",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ApprovalWorkflowDetail_TenantOffice_TenantOfficeId",
                table: "ApprovalWorkflowDetail",
                column: "TenantOfficeId",
                principalTable: "TenantOffice",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAssetPmDetail_CustomerSite_CustomerSiteId",
                table: "ContractAssetPmDetail",
                column: "CustomerSiteId",
                principalTable: "CustomerSite",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
