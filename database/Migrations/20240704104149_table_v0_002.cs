using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class table_v0_002 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NotificationSetting_Group_GroupId",
                table: "NotificationSetting");

            migrationBuilder.DropTable(
                name: "Group");

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 266);

            migrationBuilder.DropColumn(
                name: "App",
                table: "NotificationSetting");

            migrationBuilder.DropColumn(
                name: "Push",
                table: "NotificationSetting");

            migrationBuilder.DropColumn(
                name: "Sms",
                table: "NotificationSetting");

            migrationBuilder.RenameColumn(
                name: "GroupId",
                table: "NotificationSetting",
                newName: "RoleId");

            //migrationBuilder.RenameIndex(
            //    name: "IX_NotificationSetting_GroupId",
            //    table: "NotificationSetting",
            //    newName: "IX_NotificationSetting_RoleId");

            migrationBuilder.AddColumn<int>(
                name: "DocumentSize",
                table: "UserInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DocumentUrl",
                table: "UserInfo",
                type: "varchar(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiryDate",
                table: "UserInfo",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedBy",
                table: "TenantOfficeInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedOn",
                table: "TenantOfficeInfo",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CityId",
                table: "TenantInfo",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CountryId",
                table: "TenantInfo",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Pincode",
                table: "TenantInfo",
                type: "nvarchar(6)",
                maxLength: 6,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "StateId",
                table: "TenantInfo",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedBy",
                table: "TenantInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedOn",
                table: "TenantInfo",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BusinessFunctionTypeId",
                table: "BusinessFunction",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "UserBusinessUnit",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BusinessUnitId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedOn = table.Column<DateTime>(type: "datetime", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserBusinessUnit", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserBusinessUnit_UserInfo_UserId",
                        column: x => x.UserId,
                        principalTable: "UserInfo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "BusinessEvent",
                keyColumn: "Id",
                keyValue: 1,
                column: "Name",
                value: "User Created");

            migrationBuilder.UpdateData(
                table: "BusinessEvent",
                keyColumn: "Id",
                keyValue: 2,
                column: "Name",
                value: "User Approved");

            migrationBuilder.UpdateData(
                table: "BusinessEvent",
                keyColumn: "Id",
                keyValue: 3,
                column: "Name",
                value: "Contract Approval Request");

            migrationBuilder.InsertData(
                table: "BusinessEvent",
                columns: new[] { "Id", "Code", "CreatedBy", "CreatedOn", "IsActive", "Name", "UpdatedBy", "UpdatedOn" },
                values: new object[,]
                {
                    { 4, "BE04", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, "Contract Approved", null, null },
                    { 5, "BE05", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, "Contract Closed", null, null },
                    { 6, "BE06", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, "Contract Call Stop", null, null },
                    { 7, "BE07", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, "Contract Expiry Extend", null, null },
                    { 8, "BE08", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, "Contract Created", null, null },
                    { 9, "BE09", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, "Call Created", null, null },
                    { 10, "BE10", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, "Call Closed", null, null },
                    { 11, "BE11", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, "Interim Finance Approved", null, null },
                    { 12, "BE12", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, "Interim Asset Approved", null, null },
                    { 13, "BE13", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, "Customer Created", null, null },
                    { 14, "BE14", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, "Customer Approval Requested", null, null },
                    { 15, "BE15", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, "Bank Request approved", null, null },
                    { 16, "BE16", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, "Pre-amc inspection scheduled", null, null }
                });

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 1,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 2,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 3,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 4,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 5,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 6,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 7,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 8,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 9,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 10,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 11,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 12,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 13,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 14,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 15,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 16,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 17,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 18,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 19,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 20,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 21,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 22,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 23,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 24,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 25,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 26,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 27,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 28,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 29,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 30,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 31,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 32,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 33,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 34,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 35,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 36,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 37,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 38,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 39,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 40,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 41,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 42,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 43,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 44,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 45,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 46,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 47,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 48,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 49,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 50,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 51,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 52,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 53,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 54,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 55,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 56,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 57,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 58,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 59,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 60,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 61,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 62,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 63,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 64,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 65,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 66,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 67,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 68,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 69,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 70,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 71,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 72,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 73,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 74,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 75,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 76,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 77,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 78,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 79,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 80,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 81,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 82,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 83,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 84,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 85,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 86,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 87,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 88,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 89,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 90,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 91,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 92,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 93,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 94,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 95,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 96,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 97,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 98,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 99,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 100,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 101,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 102,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 103,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 104,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 105,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 106,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 107,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 108,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 109,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 110,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 111,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 112,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 113,
                column: "BusinessFunctionTypeId",
                value: 275);

            migrationBuilder.InsertData(
                table: "MasterEntity",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "Description", "EntityType" },
                values: new object[] { 61, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "Business Function Types", "BusinessFunctionType" });

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 261,
                columns: new[] { "Code", "Name" },
                values: new object[] { "BUT_AMCS", "Annual Maintenance Contract Services" });

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 262,
                columns: new[] { "Code", "Name" },
                values: new object[] { "BUT_FMSC", "Facility Management Services" });

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 263,
                columns: new[] { "Code", "Name" },
                values: new object[] { "BUT_PFSC", "Professional Services" });

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 264,
                columns: new[] { "Code", "Name" },
                values: new object[] { "BUT_DCMS", "Data Center Management Services" });

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 265,
                columns: new[] { "Code", "Name" },
                values: new object[] { "BUT_MASC", "Managed Services" });

            migrationBuilder.UpdateData(
                table: "TenantInfo",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CityId", "CountryId", "IsVerified", "Pincode", "StateId", "UpdatedBy", "UpdatedOn" },
                values: new object[] { 1, 1, true, "12321", 1, null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 19,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 21,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 22,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 24,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 25,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 26,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 27,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 28,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 29,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 30,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 31,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 32,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 33,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 34,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 35,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 36,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 37,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 38,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 39,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 40,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 41,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 42,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 43,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "TenantOfficeInfo",
                keyColumn: "Id",
                keyValue: 44,
                columns: new[] { "UpdatedBy", "UpdatedOn" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 19,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 24,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 25,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 26,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 27,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 28,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 29,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 30,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 31,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 32,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 33,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 34,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 35,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 36,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 37,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 38,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 39,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 40,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 41,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 42,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 43,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 44,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 45,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 46,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 47,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 48,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 1001,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 1002,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 12638,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13048,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13118,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13242,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13273,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13274,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13372,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13490,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13969,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14027,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14028,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14029,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14030,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14168,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14173,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14174,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14276,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14327,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14381,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14502,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 20001,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 20002,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 20003,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 90270,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 90391,
                columns: new[] { "DocumentSize", "DocumentUrl", "ExpiryDate" },
                values: new object[] { null, null, null });

            migrationBuilder.InsertData(
                table: "MasterEntityData",
                columns: new[] { "Id", "Code", "CreatedBy", "CreatedOn", "IsActive", "MasterEntityId", "ModifiedBy", "ModifiedOn", "Name" },
                values: new object[,]
                {
                    { 275, "BFT_WKFL", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 61, null, null, "Workflow" },
                    { 276, "BFT_RPRT", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 61, null, null, "Report" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_TenantInfo_CityId",
                table: "TenantInfo",
                column: "CityId");

            migrationBuilder.CreateIndex(
                name: "IX_TenantInfo_CountryId",
                table: "TenantInfo",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_TenantInfo_StateId",
                table: "TenantInfo",
                column: "StateId");

            migrationBuilder.CreateIndex(
                name: "IX_UserBusinessUnit_UserId",
                table: "UserBusinessUnit",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_NotificationSetting_Role_RoleId",
                table: "NotificationSetting",
                column: "RoleId",
                principalTable: "Role",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TenantInfo_City_CityId",
                table: "TenantInfo",
                column: "CityId",
                principalTable: "City",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TenantInfo_Country_CountryId",
                table: "TenantInfo",
                column: "CountryId",
                principalTable: "Country",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TenantInfo_State_StateId",
                table: "TenantInfo",
                column: "StateId",
                principalTable: "State",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NotificationSetting_Role_RoleId",
                table: "NotificationSetting");

            migrationBuilder.DropForeignKey(
                name: "FK_TenantInfo_City_CityId",
                table: "TenantInfo");

            migrationBuilder.DropForeignKey(
                name: "FK_TenantInfo_Country_CountryId",
                table: "TenantInfo");

            migrationBuilder.DropForeignKey(
                name: "FK_TenantInfo_State_StateId",
                table: "TenantInfo");

            migrationBuilder.DropTable(
                name: "UserBusinessUnit");

            migrationBuilder.DropIndex(
                name: "IX_TenantInfo_CityId",
                table: "TenantInfo");

            migrationBuilder.DropIndex(
                name: "IX_TenantInfo_CountryId",
                table: "TenantInfo");

            migrationBuilder.DropIndex(
                name: "IX_TenantInfo_StateId",
                table: "TenantInfo");

            migrationBuilder.DeleteData(
                table: "BusinessEvent",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "BusinessEvent",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "BusinessEvent",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "BusinessEvent",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "BusinessEvent",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "BusinessEvent",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "BusinessEvent",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "BusinessEvent",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "BusinessEvent",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "BusinessEvent",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "BusinessEvent",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "BusinessEvent",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "BusinessEvent",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 275);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 276);

            migrationBuilder.DeleteData(
                table: "MasterEntity",
                keyColumn: "Id",
                keyValue: 61);

            migrationBuilder.DropColumn(
                name: "DocumentSize",
                table: "UserInfo");

            migrationBuilder.DropColumn(
                name: "DocumentUrl",
                table: "UserInfo");

            migrationBuilder.DropColumn(
                name: "ExpiryDate",
                table: "UserInfo");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "TenantOfficeInfo");

            migrationBuilder.DropColumn(
                name: "UpdatedOn",
                table: "TenantOfficeInfo");

            migrationBuilder.DropColumn(
                name: "CityId",
                table: "TenantInfo");

            migrationBuilder.DropColumn(
                name: "CountryId",
                table: "TenantInfo");

            migrationBuilder.DropColumn(
                name: "Pincode",
                table: "TenantInfo");

            migrationBuilder.DropColumn(
                name: "StateId",
                table: "TenantInfo");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "TenantInfo");

            migrationBuilder.DropColumn(
                name: "UpdatedOn",
                table: "TenantInfo");

            migrationBuilder.DropColumn(
                name: "BusinessFunctionTypeId",
                table: "BusinessFunction");

            migrationBuilder.RenameColumn(
                name: "RoleId",
                table: "NotificationSetting",
                newName: "GroupId");

            migrationBuilder.RenameIndex(
                name: "IX_NotificationSetting_RoleId",
                table: "NotificationSetting",
                newName: "IX_NotificationSetting_GroupId");

            migrationBuilder.AddColumn<bool>(
                name: "App",
                table: "NotificationSetting",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Push",
                table: "NotificationSetting",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Sms",
                table: "NotificationSetting",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Group",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime", nullable: false),
                    DeletedBy = table.Column<int>(type: "int", nullable: true),
                    DeletedOn = table.Column<DateTime>(type: "datetime", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Name = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Group", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "BusinessEvent",
                keyColumn: "Id",
                keyValue: 1,
                column: "Name",
                value: "Contract created");

            migrationBuilder.UpdateData(
                table: "BusinessEvent",
                keyColumn: "Id",
                keyValue: 2,
                column: "Name",
                value: "Bank Request approved");

            migrationBuilder.UpdateData(
                table: "BusinessEvent",
                keyColumn: "Id",
                keyValue: 3,
                column: "Name",
                value: "Pre-amc inspection scheduled");

            migrationBuilder.InsertData(
                table: "Group",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "Name", "UpdatedBy", "UpdatedOn" },
                values: new object[,]
                {
                    { 1, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, "BeSure project team", null, null },
                    { 2, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, "Sales team", null, null },
                    { 3, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, "Call Coordinator", null, null },
                    { 4, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, "Finance team", null, null },
                    { 5, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, "Service Engineers", null, null }
                });

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 261,
                columns: new[] { "Code", "Name" },
                values: new object[] { "BUT_CSMS", "Cyber Security and Managed Services" });

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 262,
                columns: new[] { "Code", "Name" },
                values: new object[] { "BUT_ITMS", "IT Infrastructure Management Services" });

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 263,
                columns: new[] { "Code", "Name" },
                values: new object[] { "BUT_WMSV", "Warranty Management Services" });

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 264,
                columns: new[] { "Code", "Name" },
                values: new object[] { "BUT_MNPS", "Managed Print Services" });

            migrationBuilder.UpdateData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 265,
                columns: new[] { "Code", "Name" },
                values: new object[] { "BUT_SYSI", "System Integration" });

            migrationBuilder.InsertData(
                table: "MasterEntityData",
                columns: new[] { "Id", "Code", "CreatedBy", "CreatedOn", "IsActive", "MasterEntityId", "ModifiedBy", "ModifiedOn", "Name" },
                values: new object[] { 266, "BUT_PRSV", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), true, 60, null, null, "Professional Services" });

            migrationBuilder.UpdateData(
                table: "NotificationSetting",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "App", "Push", "Sms" },
                values: new object[] { true, false, true });

            migrationBuilder.UpdateData(
                table: "NotificationSetting",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "App", "Push", "Sms" },
                values: new object[] { true, false, true });

            migrationBuilder.UpdateData(
                table: "NotificationSetting",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "App", "Push", "Sms" },
                values: new object[] { true, false, true });

            migrationBuilder.UpdateData(
                table: "NotificationSetting",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "App", "Push", "Sms" },
                values: new object[] { false, true, false });

            migrationBuilder.UpdateData(
                table: "NotificationSetting",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "App", "Push", "Sms" },
                values: new object[] { true, true, true });

            migrationBuilder.UpdateData(
                table: "NotificationSetting",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "App", "Push", "Sms" },
                values: new object[] { false, true, false });

            migrationBuilder.UpdateData(
                table: "NotificationSetting",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "App", "Push", "Sms" },
                values: new object[] { false, false, true });

            migrationBuilder.UpdateData(
                table: "NotificationSetting",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "App", "Push", "Sms" },
                values: new object[] { true, true, false });

            migrationBuilder.UpdateData(
                table: "NotificationSetting",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "App", "Push", "Sms" },
                values: new object[] { false, true, false });

            migrationBuilder.UpdateData(
                table: "TenantInfo",
                keyColumn: "Id",
                keyValue: 1,
                column: "IsVerified",
                value: false);

            migrationBuilder.AddForeignKey(
                name: "FK_NotificationSetting_Group_GroupId",
                table: "NotificationSetting",
                column: "GroupId",
                principalTable: "Group",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
