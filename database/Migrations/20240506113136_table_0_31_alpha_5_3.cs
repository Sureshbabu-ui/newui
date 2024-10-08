using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class table_0_31_alpha_5_3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContractInterimAsset_ServiceRequest_ServiceRequestId1",
                table: "ContractInterimAsset");

            migrationBuilder.DropIndex(
                name: "IX_ContractInterimAsset_ServiceRequestId1",
                table: "ContractInterimAsset");

           

            migrationBuilder.DropColumn(
                name: "ServiceRequestId",
                table: "ContractInterimAsset");

            migrationBuilder.DropColumn(
                name: "ServiceRequestId1",
                table: "ContractInterimAsset");

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName" },
                values: new object[] { "BANK_MANAGE", "Bank Manage" });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "BusinessFunctionCode", "BusinessModuleId" },
                values: new object[] { "LOOKUPDATA_MANAGE", 5 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "BUSINESSDIVISION_VIEW", "Business Division View", 5 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "BANKBRANCH_VIEW", "Bank Branch VIEW", 5 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "ASSETPRODUCTCATEGORY_VIEW", "Asset Product Category View", 5 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 13,
                column: "BusinessModuleId",
                value: 5);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "MAKE_VIEW", "Make View", 5 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "PRODUCTMODEL_MANAGE", "Product Model Manage", 5 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "PRODUCTMODEL_VIEW", "Product Model View", 5 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "PARTCATEGORY_VIEW", "Part Category View", 5 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "PART_VIEW", "Part View", 5 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 19,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "DESIGNATION_VIEW", "Designation View", 5 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "ROLE_VIEW", "Role View", 5 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 21,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "CUSTOMERGROUP_MANAGE", "Customer Group Manage", 5 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 22,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "CUSTOMERGROUP_VIEW", "Customer Group View", 5 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "PAYMENTFREQUENCY_VIEW", "Payment Frequency VIEW", 5 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 25,
                column: "BusinessModuleId",
                value: 6);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 26,
                column: "BusinessModuleId",
                value: 7);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 27,
                column: "BusinessModuleId",
                value: 7);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 28,
                column: "BusinessModuleId",
                value: 7);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 29,
                column: "BusinessModuleId",
                value: 7);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 30,
                column: "BusinessModuleId",
                value: 7);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 31,
                column: "BusinessModuleId",
                value: 7);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 37,
                column: "BusinessModuleId",
                value: 8);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 38,
                column: "BusinessModuleId",
                value: 8);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 39,
                column: "BusinessModuleId",
                value: 6);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 48,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "INVOICEPREREQUISITE_VIEW", "Invoice Prerequisite View", 5 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 49,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "INVOICEPREREQUISITE_MANAGE", "Invoice Prerequisite Manage", 5 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 50,
                column: "BusinessModuleId",
                value: 9);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 51,
                column: "BusinessModuleId",
                value: 9);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 52,
                column: "BusinessModuleId",
                value: 9);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 53,
                column: "BusinessModuleId",
                value: 10);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 54,
                column: "BusinessModuleId",
                value: 10);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 55,
                column: "BusinessModuleId",
                value: 11);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 56,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "STOCKROOM_MANAGE", "Stock Room Manage", 5 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 57,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "STOCKROOM_VIEW", "Stock Room View", 5 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 58,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "STOCKBIN_MANAGE", "Stock Bin Manage", 5 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 59,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "STOCKBIN_VIEW", "Stock Bin View", 5 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 60,
                column: "BusinessModuleId",
                value: 12);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 61,
                column: "BusinessModuleId",
                value: 12);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 62,
                column: "BusinessModuleId",
                value: 13);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 63,
                column: "BusinessModuleId",
                value: 13);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 64,
                column: "BusinessModuleId",
                value: 11);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 70,
                column: "BusinessModuleId",
                value: 14);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 71,
                column: "BusinessModuleId",
                value: 14);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 72,
                column: "BusinessModuleId",
                value: 14);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 73,
                column: "BusinessModuleId",
                value: 14);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 74,
                column: "BusinessModuleId",
                value: 14);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 75,
                column: "BusinessModuleId",
                value: 14);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 76,
                column: "BusinessModuleId",
                value: 14);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 77,
                column: "BusinessModuleId",
                value: 15);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 78,
                column: "BusinessModuleId",
                value: 15);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 79,
                column: "BusinessModuleId",
                value: 15);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 80,
                column: "BusinessModuleId",
                value: 16);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 81,
                column: "BusinessModuleId",
                value: 16);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 84,
                column: "BusinessModuleId",
                value: 17);

            migrationBuilder.DeleteData(
               table: "BusinessModule",
               keyColumn: "Id",
               keyValue: 18);

            migrationBuilder.DeleteData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 32);

            migrationBuilder.DeleteData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 33);

            migrationBuilder.DeleteData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 34);

            migrationBuilder.DeleteData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 35);

            migrationBuilder.InsertData(
                table: "BusinessFunction",
                columns: new[] { "Id", "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId", "CreatedBy", "CreatedOn", "Description", "IsActive", "UpdatedBy", "UpdatedOn" },
                values: new object[,]
                {
                    { 85, "ALL_USER_LOGIN_HISTORY", "Users Login History", 4, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 86, "BANKBRANCH_MANAGE", "Bank Branch MANAGE", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 87, "ASSETPRODUCTCATEGORY_MANAGE", "Asset Product Category Manage", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 88, "BUSINESSDIVISION_MANAGE", "Business Division Manage", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 89, "BUSINESSFUNCTION_VIEW", "Business Function View", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 90, "BUSINESSMODULE_VIEW", "Business Module View", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 91, "CITY_VIEW", "City View", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 92, "DESIGNATION_MANAGE", "Designation Manage", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 93, "LOOKUPDATA_VIEW", "Lookupdata View", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 94, "MAKE_MANAGE", "Make Manage", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 95, "PART_MANAGE", "Part Manage", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 96, "PARTCATEGORY_MANAGE", "Part Category Manage", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 97, "PARTPRODUCTCATEGORY_MANAGE", "Part Product Category Manage", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 98, "PARTPRODUCTCATEGORY_VIEW", "Part Product Category View", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 99, "PAYMENTFREQUENCY_MANAGE", "Payment Frequency Manage", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 100, "ROLE_MANAGE", "Role Manage", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 101, "ROLEPERMISSION_VIEW", "Role Permission View", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 102, "ROLEPERMISSION_MANAGE", "Role Permission Manage", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 103, "STATE_VIEW", "State View", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 104, "BUSINESSEVENT_MANAGE", "Business Event Manage", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 105, "BUSINESSEVENT_VIEW", "Business Event View", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 106, "PARTSUBCATEGORY_VIEW", "Part Sub Category View", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 107, "PARTSUBCATEGORY_MANAGE", "Part Sub Category Manage", 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null }
                });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Master Data", "All master data in the system are managed here. Each master data will have it's own code, name and active status." });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Approval", "Approval systems in software streamline and formalize the process of granting authorization for data, enhancing accountability and ensuring compliance by avoiding erroneous or duplicate data." });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Customer", "The customer module serves as the centralized database for managing customer information and their business details like sites, contracts etc." });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Accel", "Details about Accel regions, locations and basic company information that helps in other modules" });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Bank Collection", "Manage to upload and map financial collections received in Accel bank accounts as part of the raised contract invoices" });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Receipt", "Displays receipt generated as part of invoice collections received, processed and mapped  by the finance department" });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Invoice Reconciliation", "Manages to compare and match invoices with corresponding payments from the customer side" });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Inventory", "Module to manage the stock of goods or materials that a business holds for production, sale, or distribution" });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Part Indent", "Manages the creation and listing of specific part requests in a service request to the warehouse." });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Part Indent Demand", "Manages the creation and listing of specific part indent demands in a service request to the warehouse." });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Contract Invoice", "Manages the approval,creation and listing of contract invoices." });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Goods Received Note", "Manages the creation and listing of specific goods received notes and its details" });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Delivery Challan", "Manages the creation and listing of specific delivery challan and its details" });

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 35,
                column: "OfficeName",
                value: "Head Office");

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 8,
                column: "TenantOfficeId",
                value: 35);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 10,
                column: "TenantOfficeId",
                value: 35);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 11,
                column: "TenantOfficeId",
                value: 35);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 12,
                column: "TenantOfficeId",
                value: 35);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13,
                column: "TenantOfficeId",
                value: 35);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14,
                column: "TenantOfficeId",
                value: 35);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "TenantOfficeId", "UserCategoryId" },
                values: new object[] { 42, 54 });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "TenantOfficeId", "UserCategoryId" },
                values: new object[] { 42, 54 });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 18,
                column: "TenantOfficeId",
                value: 35);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 19,
                column: "TenantOfficeId",
                value: 35);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "TenantOfficeId", "UserCategoryId" },
                values: new object[] { 38, 54 });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 24,
                columns: new[] { "TenantOfficeId", "UserCategoryId" },
                values: new object[] { 37, 54 });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 26,
                columns: new[] { "TenantOfficeId", "UserCategoryId" },
                values: new object[] { 42, 54 });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 27,
                column: "TenantOfficeId",
                value: 35);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 28,
                column: "TenantOfficeId",
                value: 35);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 29,
                column: "TenantOfficeId",
                value: 35);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 30,
                column: "UserCategoryId",
                value: 53);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 31,
                column: "UserCategoryId",
                value: 53);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 32,
                column: "UserCategoryId",
                value: 53);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 33,
                column: "UserCategoryId",
                value: 53);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 34,
                column: "UserCategoryId",
                value: 53);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 35,
                column: "UserCategoryId",
                value: 53);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 36,
                column: "UserCategoryId",
                value: 53);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 37,
                column: "TenantOfficeId",
                value: 37);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 39,
                columns: new[] { "TenantOfficeId", "UserCategoryId" },
                values: new object[] { 39, 54 });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 40,
                column: "TenantOfficeId",
                value: 35);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 43,
                columns: new[] { "Email", "TenantOfficeId", "UserCategoryId" },
                values: new object[] { "manikandan.sp@accelits.com", 42, 54 });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 44,
                column: "TenantOfficeId",
                value: 35);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 45,
                column: "TenantOfficeId",
                value: 35);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 46,
                column: "TenantOfficeId",
                value: 35);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 47,
                columns: new[] { "TenantOfficeId", "UserCategoryId" },
                values: new object[] { 40, 54 });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 48,
                columns: new[] { "TenantOfficeId", "UserCategoryId" },
                values: new object[] { 39, 54 });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 1001,
                column: "TenantOfficeId",
                value: 35);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 1002,
                column: "TenantOfficeId",
                value: 35);

            migrationBuilder.InsertData(
                table: "RoleBusinessFunctionPermission",
                columns: new[] { "Id", "BusinessFunctionId", "CreatedBy", "CreatedOn", "RoleId" },
                values: new object[,]
                {
                    { 20000, 85, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 1 },
                    { 20001, 101, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 6 },
                    { 20002, 102, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 6 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 86);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 87);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 88);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 89);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 90);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 91);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 92);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 93);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 94);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 95);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 96);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 97);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 98);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 99);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 100);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 103);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 104);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 105);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 106);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 107);

            migrationBuilder.DeleteData(
                table: "RoleBusinessFunctionPermission",
                keyColumn: "Id",
                keyValue: 20000);

            migrationBuilder.DeleteData(
                table: "RoleBusinessFunctionPermission",
                keyColumn: "Id",
                keyValue: 20001);

            migrationBuilder.DeleteData(
                table: "RoleBusinessFunctionPermission",
                keyColumn: "Id",
                keyValue: 20002);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 85);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 101);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 102);

            migrationBuilder.AddColumn<int>(
                name: "ServiceRequestId",
                table: "ContractInterimAsset",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ServiceRequestId1",
                table: "ContractInterimAsset",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName" },
                values: new object[] { "BANK_ACCOUNTS", "Bank Create" });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "BusinessFunctionCode", "BusinessModuleId" },
                values: new object[] { "APP_MANAGE", 6 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "BUSINESS_DIVISION_LIST", "Business Division List", 7 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "BANK_BRANCH_LIST", "Bank Branch List", 8 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "PRODUCT_CATEGORY_VIEW", "Product Category View", 9 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 13,
                column: "BusinessModuleId",
                value: 9);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "MAKE_LIST", "Make List", 10 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "PRODUCT_CREATE", "Product Create", 11 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "PRODUCT_LIST", "Product List", 11 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "PART_CATEGORY_LIST", "Part Category List", 12 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "PART_LIST", "Part List", 13 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 19,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "DESIGNATION_LIST", "Designation List", 14 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "ROLE_LIST", "Role List", 15 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 21,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "CUSTOMER_GROUP_CREATE", "Customer Group Create", 17 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 22,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "CUSTOMER_GROUP_LIST", "Customer Group List", 17 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "PAYMENT_FREQUENCY_LIST", "Payment Frequency List", 18 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 25,
                column: "BusinessModuleId",
                value: 22);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 26,
                column: "BusinessModuleId",
                value: 23);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 27,
                column: "BusinessModuleId",
                value: 23);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 28,
                column: "BusinessModuleId",
                value: 23);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 29,
                column: "BusinessModuleId",
                value: 23);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 30,
                column: "BusinessModuleId",
                value: 23);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 31,
                column: "BusinessModuleId",
                value: 23);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 37,
                column: "BusinessModuleId",
                value: 24);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 38,
                column: "BusinessModuleId",
                value: 24);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 39,
                column: "BusinessModuleId",
                value: 22);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 48,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "INVOICE_PREREQUISITE_CREATE", "Invoice Prerequisite create", 6 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 49,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "INVOICE_PREREQUISITE_UPDATE", "Invoice Prerequisite update", 6 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 50,
                column: "BusinessModuleId",
                value: 25);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 51,
                column: "BusinessModuleId",
                value: 25);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 52,
                column: "BusinessModuleId",
                value: 25);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 53,
                column: "BusinessModuleId",
                value: 26);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 54,
                column: "BusinessModuleId",
                value: 26);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 55,
                column: "BusinessModuleId",
                value: 27);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 56,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "STOCKROOM_CREATE", "Stock Room Create", 28 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 57,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "STOCKROOM_LIST", "Stock Room List", 28 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 58,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "STOCKBIN_CREATE", "Stock Bin Create", 29 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 59,
                columns: new[] { "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId" },
                values: new object[] { "STOCKBIN_LIST", "Stock Bin List", 29 });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 60,
                column: "BusinessModuleId",
                value: 30);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 61,
                column: "BusinessModuleId",
                value: 30);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 62,
                column: "BusinessModuleId",
                value: 31);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 63,
                column: "BusinessModuleId",
                value: 31);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 64,
                column: "BusinessModuleId",
                value: 27);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 70,
                column: "BusinessModuleId",
                value: 32);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 71,
                column: "BusinessModuleId",
                value: 32);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 72,
                column: "BusinessModuleId",
                value: 32);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 73,
                column: "BusinessModuleId",
                value: 32);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 74,
                column: "BusinessModuleId",
                value: 32);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 75,
                column: "BusinessModuleId",
                value: 32);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 76,
                column: "BusinessModuleId",
                value: 32);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 77,
                column: "BusinessModuleId",
                value: 33);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 78,
                column: "BusinessModuleId",
                value: 33);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 79,
                column: "BusinessModuleId",
                value: 33);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 80,
                column: "BusinessModuleId",
                value: 34);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 81,
                column: "BusinessModuleId",
                value: 34);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 84,
                column: "BusinessModuleId",
                value: 35);

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Banks", "Manage bank names from here. Creation and modification needs approval from the higher authority." });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Lookup Data", "All master data in the system are managed here. Each master data will have it's own code, name and active status." });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Business Division", "Master data module for Accel's business divisions." });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Bank Branch", "Manage each bank's branch details from here." });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Product Category", "A product category is a classification system used to organize and group similar products based on their intended use" });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Make", "A make or a company name is the official designation that identifies a particular business entity. All products or parts will have the attributes product category and make." });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Product", "A product or product model refers to a specific variant or version of a product that shares similar characteristics, features, and specifications within a product line." });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Part Category", "A part category is a classification system for parts to organize and group similar parts based on their intended use" });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Part", "A part is a fundamental building block of electronic circuits and devices" });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Designation", "Designations refer to specific titles or roles assigned to individuals within an organization, indicating their level of authority, responsibility, or expertise." });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Role", "Roles in BeSure defines the specific permissions and responsibilities assigned to users, governing their access and actions within the system." });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Business Event", "A business event in software code triggers a specific action or set of actions in response to a predefined occurrence within a business process." });

            migrationBuilder.UpdateData(
                table: "BusinessModule",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "BusinessModuleName", "Description" },
                values: new object[] { "Customer Group", "Customer groups are segmented categories of individuals or entities with similar characteristics or purchasing behaviors, enabling targeted marketing and tailored services." });

            migrationBuilder.InsertData(
                table: "BusinessModule",
                columns: new[] { "Id", "BusinessModuleName", "CreatedBy", "CreatedOn", "Description", "IsActive", "UpdatedBy", "UpdatedOn" },
                values: new object[,]
                {
                    { 18, "Payment Frequency", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Payment frequency refers to the regular intervals at which payments are made, such as monthly, half-yearly or annually.", true, null, null },
                    { 19, "Business Module", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Business modules are modular units, encompassing specific functions or processes tailored to streamline and optimize various aspects of business operations.", true, null, null },
                    { 20, "Business Function", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "A business function refers to a specific operational area or activity within an application such as create, list, edit or delete module data.", true, null, null },
                    { 21, "Role Permission", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Role permissions define the specific actions and access levels granted to users within an organization based on their designated roles.", true, null, null },
                    { 22, "Approval", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Approval systems in software streamline and formalize the process of granting authorization for data, enhancing accountability and ensuring compliance by avoiding erroneous or duplicate data.", true, null, null },
                    { 23, "Customer", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "The customer module serves as the centralized database for managing customer information and their business details like sites, contracts etc.", true, null, null },
                    { 24, "Accel", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Details about Accel regions, locations and basic company information that helps in other modules", true, null, null },
                    { 25, "Bank Collection", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Manage to upload and map financial collections received in Accel bank accounts as part of the raised contract invoices", true, null, null },
                    { 26, "Receipt", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Displays receipt generated as part of invoice collections received, processed and mapped  by the finance department", true, null, null },
                    { 27, "Invoice Reconciliation", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Manages to compare and match invoices with corresponding payments from the customer side", true, null, null },
                    { 28, "Stock Room", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Module to  manage the designated storage area where inventory and supplies are organized and stored for efficient management and distribution", true, null, null },
                    { 29, "Stock Bin", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Module to manage designated storage compartments within the warehouse or facility used for organizing and storing inventory items efficiently", true, null, null },
                    { 30, "Inventory", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Module to manage the stock of goods or materials that a business holds for production, sale, or distribution", true, null, null },
                    { 31, "Part Indent", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Manages the creation and listing of specific part requests in a service request to the warehouse.", true, null, null },
                    { 32, "Part Indent Demand", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Manages the creation and listing of specific part indent demands in a service request to the warehouse.", true, null, null },
                    { 33, "Contract Invoice", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Manages the approval,creation and listing of contract invoices.", true, null, null },
                    { 34, "Goods Received Note", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Manages the creation and listing of specific goods received notes and its details", true, null, null },
                    { 35, "Delivery Challan", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Manages the creation and listing of specific delivery challan and its details", true, null, null }
                });

            migrationBuilder.UpdateData(
                table: "TenantOffice",
                keyColumn: "Id",
                keyValue: 35,
                column: "OfficeName",
                value: "Head Office Chennai");

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 8,
                column: "TenantOfficeId",
                value: 16);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 10,
                column: "TenantOfficeId",
                value: 20);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 11,
                column: "TenantOfficeId",
                value: 20);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 12,
                column: "TenantOfficeId",
                value: 20);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13,
                column: "TenantOfficeId",
                value: 20);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14,
                column: "TenantOfficeId",
                value: 20);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "TenantOfficeId", "UserCategoryId" },
                values: new object[] { 20, 55 });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "TenantOfficeId", "UserCategoryId" },
                values: new object[] { 20, 55 });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 18,
                column: "TenantOfficeId",
                value: 20);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 19,
                column: "TenantOfficeId",
                value: 20);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "TenantOfficeId", "UserCategoryId" },
                values: new object[] { 2, 55 });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 24,
                columns: new[] { "TenantOfficeId", "UserCategoryId" },
                values: new object[] { 16, 55 });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 26,
                columns: new[] { "TenantOfficeId", "UserCategoryId" },
                values: new object[] { 20, 55 });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 27,
                column: "TenantOfficeId",
                value: 20);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 28,
                column: "TenantOfficeId",
                value: 20);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 29,
                column: "TenantOfficeId",
                value: 20);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 30,
                column: "UserCategoryId",
                value: 55);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 31,
                column: "UserCategoryId",
                value: 55);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 32,
                column: "UserCategoryId",
                value: 55);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 33,
                column: "UserCategoryId",
                value: 55);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 34,
                column: "UserCategoryId",
                value: 55);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 35,
                column: "UserCategoryId",
                value: 55);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 36,
                column: "UserCategoryId",
                value: 55);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 37,
                column: "TenantOfficeId",
                value: 16);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 39,
                columns: new[] { "TenantOfficeId", "UserCategoryId" },
                values: new object[] { 28, 55 });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 40,
                column: "TenantOfficeId",
                value: 20);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 43,
                columns: new[] { "Email", "TenantOfficeId", "UserCategoryId" },
                values: new object[] { "manikandan.sp@accelits.com; ", 20, 55 });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 44,
                column: "TenantOfficeId",
                value: 16);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 45,
                column: "TenantOfficeId",
                value: 20);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 46,
                column: "TenantOfficeId",
                value: 20);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 47,
                columns: new[] { "TenantOfficeId", "UserCategoryId" },
                values: new object[] { 10, 55 });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 48,
                columns: new[] { "TenantOfficeId", "UserCategoryId" },
                values: new object[] { 28, 55 });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 1001,
                column: "TenantOfficeId",
                value: 20);

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 1002,
                column: "TenantOfficeId",
                value: 20);

            migrationBuilder.CreateIndex(
                name: "IX_ContractInterimAsset_ServiceRequestId1",
                table: "ContractInterimAsset",
                column: "ServiceRequestId1");

            migrationBuilder.AddForeignKey(
                name: "FK_ContractInterimAsset_ServiceRequest_ServiceRequestId1",
                table: "ContractInterimAsset",
                column: "ServiceRequestId1",
                principalTable: "ServiceRequest",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
