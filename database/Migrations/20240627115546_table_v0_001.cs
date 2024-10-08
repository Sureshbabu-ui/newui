using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class table_v0_001 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropIndex(
           name: "IX_PurchaseOrder_PartIndentRequestId",
           table: "PurchaseOrder");

            migrationBuilder.DropForeignKey(
                name: "FK_PurchaseOrder_PartIndentRequest_PartIndentRequestId",
                table: "PurchaseOrder");

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 94);

            migrationBuilder.DropColumn(
                name: "PartIndentRequestId",
                table: "PurchaseOrder");

            migrationBuilder.AddColumn<DateTime>(
                name: "LoggedOutOn",
                table: "UserLoginHistory",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TokenVersion",
                table: "UserLoginHistory",
                type: "int",
                nullable: true,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CurrentTokenVersion",
                table: "UserLogin",
                type: "int",
                nullable: true,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsConcurrentLoginAllowed",
                table: "UserLogin",
                type: "bit",
                nullable: true,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "TicketNumber",
                table: "ServiceRequest",
                type: "varchar(16)",
                maxLength: 16,
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                table: "Role",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Role",
                type: "varchar(16)",
                maxLength: 16,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(8)",
                oldMaxLength: 8);

            migrationBuilder.AddColumn<int>(
                name: "DeletedBy",
                table: "Role",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedOn",
                table: "Role",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Role",
                type: "bit",
                nullable: true,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsSystemRole",
                table: "Role",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "DeletedReason",
                table: "Receipt",
                type: "varchar(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PartIndentRequestId",
                table: "PurchaseOrderDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "InvoiceReceipt",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<string>(
                name: "DebitNoteNumberFormat",
                table: "BusinessSetting",
                type: "varchar(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "DebitNote",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DebitNoteNumber = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: false),
                    DebitNoteDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    CustomerId = table.Column<int>(type: "int", nullable: true),
                    VendorId = table.Column<int>(type: "int", nullable: true),
                    Amount = table.Column<decimal>(type: "decimal(16,2)", nullable: false, defaultValue: 0m),
                    Remarks = table.Column<string>(type: "varchar(128)", maxLength: 128, nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DebitNote", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DebitNote_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DebitNote_Vendor_VendorId",
                        column: x => x.VendorId,
                        principalTable: "Vendor",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "AppSetting",
                columns: new[] { "Id", "AppKey", "AppValue", "CreatedBy", "CreatedOn", "UpdatedBy", "UpdatedOn" },
                values: new object[,]
                {
                    { 26, "LastDebitNoteNumber", "0", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null },
                    { 27, "OTPExpiryTime", "15", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null },
                    { 28, "PasswordExpiryPeriodInDays", "60", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null },
                    { 29, "PasswordExpiryNoticeInDays", "5", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null },
                    { 30, "MaximumLoginHistoryCount", "100000", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null }
                });

            migrationBuilder.UpdateData(
                table: "BusinessSetting",
                keyColumn: "Id",
                keyValue: 1,
                column: "DebitNoteNumberFormat",
                value: "ACC/{LOC}/{YYYY}/{SNO}");

            migrationBuilder.InsertData(
                table: "MasterEntity",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "Description", "EntityType" },
                values: new object[] { 60, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Business Units", "BusinessUnit" });

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 93,
                columns: new[] { "Code", "Name" },
                values: new object[] { "SRS_PNDG", "Pending for response" });

            migrationBuilder.InsertData(
                table: "MasterEntityData",
                columns: new[] { "Id", "Code", "CreatedBy", "CreatedOn", "IsActive", "MasterEntityId", "ModifiedBy", "ModifiedOn", "Name" },
                values: new object[,]
                {
                    { 259, "ECA_SBME", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 8, null, null, "SME" },
                    { 260, "ENG_APRC", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 10, null, null, "Apprentice" }
                });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted", "IsSystemRole" },
                values: new object[] { null, null, false, true });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 19,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 21,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 22,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 24,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 25,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 26,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 27,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 28,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 29,
                columns: new[] { "DeletedBy", "DeletedOn", "IsDeleted" },
                values: new object[] { null, null, false });

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "Code", "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "Name", "UpdatedBy", "UpdatedOn" },
                values: new object[] { 50, "TSG", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, "Technical Support Group", null, null });

            migrationBuilder.UpdateData(
                table: "State",
                keyColumn: "Id",
                keyValue: 11,
                column: "GstStateCode",
                value: "06");

            migrationBuilder.UpdateData(
                table: "State",
                keyColumn: "Id",
                keyValue: 12,
                column: "GstStateCode",
                value: "02");

            migrationBuilder.UpdateData(
                table: "State",
                keyColumn: "Id",
                keyValue: 21,
                column: "GstStateCode",
                value: "03");

            migrationBuilder.UpdateData(
                table: "State",
                keyColumn: "Id",
                keyValue: 22,
                column: "GstStateCode",
                value: "08");

            migrationBuilder.UpdateData(
                table: "State",
                keyColumn: "Id",
                keyValue: 26,
                column: "GstStateCode",
                value: "09");

            migrationBuilder.UpdateData(
                table: "State",
                keyColumn: "Id",
                keyValue: 27,
                column: "GstStateCode",
                value: "05");

            migrationBuilder.UpdateData(
                table: "State",
                keyColumn: "Id",
                keyValue: 29,
                column: "GstStateCode",
                value: "07");

            migrationBuilder.UpdateData(
                table: "State",
                keyColumn: "Id",
                keyValue: 30,
                column: "GstStateCode",
                value: "01");

            migrationBuilder.UpdateData(
                table: "State",
                keyColumn: "Id",
                keyValue: 33,
                column: "GstStateCode",
                value: "04");

            migrationBuilder.InsertData(
                table: "MasterEntityData",
                columns: new[] { "Id", "Code", "CreatedBy", "CreatedOn", "IsActive", "MasterEntityId", "ModifiedBy", "ModifiedOn", "Name" },
                values: new object[,]
                {
                    { 261, "BUT_CSMS", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 60, null, null, "Cyber Security and Managed Services" },
                    { 262, "BUT_ITMS", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 60, null, null, "IT Infrastructure Management Services" },
                    { 263, "BUT_WMSV", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 60, null, null, "Warranty Management Services" },
                    { 264, "BUT_MNPS", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 60, null, null, "Managed Print Services" },
                    { 265, "BUT_SYSI", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 60, null, null, "System Integration" },
                    { 266, "BUT_PRSV", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 60, null, null, "Professional Services" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserInfo_EmployeeCode",
                table: "UserInfo",
                column: "EmployeeCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRequest_CaseId",
                table: "ServiceRequest",
                column: "CaseId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRequest_TicketNumber",
                table: "ServiceRequest",
                column: "TicketNumber",
                unique: true,
                filter: "[TicketNumber] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRequest_WorkOrderNumber",
                table: "ServiceRequest",
                column: "WorkOrderNumber",
                unique: true,
                filter: "[WorkOrderNumber] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Role_Code",
                table: "Role",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Role_Name",
                table: "Role",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrderDetail_PartIndentRequestId",
                table: "PurchaseOrderDetail",
                column: "PartIndentRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_DebitNote_CustomerId",
                table: "DebitNote",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_DebitNote_VendorId",
                table: "DebitNote",
                column: "VendorId");

            migrationBuilder.AddForeignKey(
                name: "FK_PurchaseOrderDetail_PartIndentRequest_PartIndentRequestId",
                table: "PurchaseOrderDetail",
                column: "PartIndentRequestId",
                principalTable: "PartIndentRequest",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PurchaseOrderDetail_PartIndentRequest_PartIndentRequestId",
                table: "PurchaseOrderDetail");

            migrationBuilder.DropTable(
                name: "DebitNote");

            migrationBuilder.DropIndex(
                name: "IX_UserInfo_EmployeeCode",
                table: "UserInfo");

            migrationBuilder.DropIndex(
                name: "IX_ServiceRequest_CaseId",
                table: "ServiceRequest");

            migrationBuilder.DropIndex(
                name: "IX_ServiceRequest_TicketNumber",
                table: "ServiceRequest");

            migrationBuilder.DropIndex(
                name: "IX_ServiceRequest_WorkOrderNumber",
                table: "ServiceRequest");

            migrationBuilder.DropIndex(
                name: "IX_Role_Code",
                table: "Role");

            migrationBuilder.DropIndex(
                name: "IX_Role_Name",
                table: "Role");

            migrationBuilder.DropIndex(
                name: "IX_PurchaseOrderDetail_PartIndentRequestId",
                table: "PurchaseOrderDetail");

            migrationBuilder.DeleteData(
                table: "AppSetting",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "AppSetting",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "AppSetting",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "AppSetting",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "AppSetting",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 259);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 260);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 261);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 262);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 263);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 264);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 265);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 266);

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: 50);

            migrationBuilder.DeleteData(
                table: "MasterEntity",
                keyColumn: "Id",
                keyValue: 60);

            migrationBuilder.DropColumn(
                name: "LoggedOutOn",
                table: "UserLoginHistory");

            migrationBuilder.DropColumn(
                name: "TokenVersion",
                table: "UserLoginHistory");

            migrationBuilder.DropColumn(
                name: "CurrentTokenVersion",
                table: "UserLogin");

            migrationBuilder.DropColumn(
                name: "IsConcurrentLoginAllowed",
                table: "UserLogin");

            migrationBuilder.DropColumn(
                name: "TicketNumber",
                table: "ServiceRequest");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "Role");

            migrationBuilder.DropColumn(
                name: "DeletedOn",
                table: "Role");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Role");

            migrationBuilder.DropColumn(
                name: "IsSystemRole",
                table: "Role");

            migrationBuilder.DropColumn(
                name: "DeletedReason",
                table: "Receipt");

            migrationBuilder.DropColumn(
                name: "PartIndentRequestId",
                table: "PurchaseOrderDetail");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "InvoiceReceipt");

            migrationBuilder.DropColumn(
                name: "DebitNoteNumberFormat",
                table: "BusinessSetting");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                table: "Role",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Role",
                type: "varchar(8)",
                maxLength: 8,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(16)",
                oldMaxLength: 16);

            migrationBuilder.AddColumn<int>(
                name: "PartIndentRequestId",
                table: "PurchaseOrder",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 93,
                columns: new[] { "Code", "Name" },
                values: new object[] { "SRS_RPIR", "Repair" });

            migrationBuilder.InsertData(
                table: "MasterEntityData",
                columns: new[] { "Id", "Code", "CreatedBy", "CreatedOn", "IsActive", "MasterEntityId", "ModifiedBy", "ModifiedOn", "Name" },
                values: new object[] { 94, "SRS_PNDG", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 24, null, null, "Pending for response" });

            migrationBuilder.UpdateData(
                table: "State",
                keyColumn: "Id",
                keyValue: 11,
                column: "GstStateCode",
                value: "6");

            migrationBuilder.UpdateData(
                table: "State",
                keyColumn: "Id",
                keyValue: 12,
                column: "GstStateCode",
                value: "2");

            migrationBuilder.UpdateData(
                table: "State",
                keyColumn: "Id",
                keyValue: 21,
                column: "GstStateCode",
                value: "3");

            migrationBuilder.UpdateData(
                table: "State",
                keyColumn: "Id",
                keyValue: 22,
                column: "GstStateCode",
                value: "8");

            migrationBuilder.UpdateData(
                table: "State",
                keyColumn: "Id",
                keyValue: 26,
                column: "GstStateCode",
                value: "9");

            migrationBuilder.UpdateData(
                table: "State",
                keyColumn: "Id",
                keyValue: 27,
                column: "GstStateCode",
                value: "5");

            migrationBuilder.UpdateData(
                table: "State",
                keyColumn: "Id",
                keyValue: 29,
                column: "GstStateCode",
                value: "7");

            migrationBuilder.UpdateData(
                table: "State",
                keyColumn: "Id",
                keyValue: 30,
                column: "GstStateCode",
                value: "1");

            migrationBuilder.UpdateData(
                table: "State",
                keyColumn: "Id",
                keyValue: 33,
                column: "GstStateCode",
                value: "4");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrder_PartIndentRequestId",
                table: "PurchaseOrder",
                column: "PartIndentRequestId");

            migrationBuilder.AddForeignKey(
                name: "FK_PurchaseOrder_PartIndentRequest_PartIndentRequestId",
                table: "PurchaseOrder",
                column: "PartIndentRequestId",
                principalTable: "PartIndentRequest",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
