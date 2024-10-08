using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class table_0_31_alpha_6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EngineerHomeLocation",
                table: "ServiceEngineerInfo");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "ServiceEngineerInfo",
                type: "varchar(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CityId",
                table: "ServiceEngineerInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CountryId",
                table: "ServiceEngineerInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Pincode",
                table: "ServiceEngineerInfo",
                type: "varchar(8)",
                maxLength: 8,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "StateId",
                table: "ServiceEngineerInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeliveryChallanId",
                table: "GoodsIssuedReceivedNote",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 80,
                column: "BusinessFunctionCode",
                value: "GOODSRECEIVEDNOTE_VIEW");

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 81,
                column: "BusinessFunctionCode",
                value: "GOODSRECEIVEDNOTE_CREATE");

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 84,
                column: "BusinessFunctionCode",
                value: "DELIVERYCHALLAN_CREATE");

            migrationBuilder.InsertData(
                table: "BusinessFunction",
                columns: new[] { "Id", "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId", "CreatedBy", "CreatedOn", "Description", "IsActive", "UpdatedBy", "UpdatedOn" },
                values: new object[] { 108, "DELIVERYCHALLAN_VIEW", "Delivery Challan List", 17, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null });

            migrationBuilder.CreateIndex(
                name: "IX_ServiceEngineerInfo_CityId",
                table: "ServiceEngineerInfo",
                column: "CityId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceEngineerInfo_CountryId",
                table: "ServiceEngineerInfo",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceEngineerInfo_StateId",
                table: "ServiceEngineerInfo",
                column: "StateId");

            migrationBuilder.CreateIndex(
                name: "IX_GoodsIssuedReceivedNote_DeliveryChallanId",
                table: "GoodsIssuedReceivedNote",
                column: "DeliveryChallanId");

            migrationBuilder.AddForeignKey(
                name: "FK_GoodsIssuedReceivedNote_DeliveryChallan_DeliveryChallanId",
                table: "GoodsIssuedReceivedNote",
                column: "DeliveryChallanId",
                principalTable: "DeliveryChallan",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceEngineerInfo_City_CityId",
                table: "ServiceEngineerInfo",
                column: "CityId",
                principalTable: "City",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceEngineerInfo_Country_CountryId",
                table: "ServiceEngineerInfo",
                column: "CountryId",
                principalTable: "Country",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceEngineerInfo_State_StateId",
                table: "ServiceEngineerInfo",
                column: "StateId",
                principalTable: "State",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GoodsIssuedReceivedNote_DeliveryChallan_DeliveryChallanId",
                table: "GoodsIssuedReceivedNote");

            migrationBuilder.DropForeignKey(
                name: "FK_ServiceEngineerInfo_City_CityId",
                table: "ServiceEngineerInfo");

            migrationBuilder.DropForeignKey(
                name: "FK_ServiceEngineerInfo_Country_CountryId",
                table: "ServiceEngineerInfo");

            migrationBuilder.DropForeignKey(
                name: "FK_ServiceEngineerInfo_State_StateId",
                table: "ServiceEngineerInfo");

            migrationBuilder.DropIndex(
                name: "IX_ServiceEngineerInfo_CityId",
                table: "ServiceEngineerInfo");

            migrationBuilder.DropIndex(
                name: "IX_ServiceEngineerInfo_CountryId",
                table: "ServiceEngineerInfo");

            migrationBuilder.DropIndex(
                name: "IX_ServiceEngineerInfo_StateId",
                table: "ServiceEngineerInfo");

            migrationBuilder.DropIndex(
                name: "IX_GoodsIssuedReceivedNote_DeliveryChallanId",
                table: "GoodsIssuedReceivedNote");

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 108);

            migrationBuilder.DropColumn(
                name: "Address",
                table: "ServiceEngineerInfo");

            migrationBuilder.DropColumn(
                name: "CityId",
                table: "ServiceEngineerInfo");

            migrationBuilder.DropColumn(
                name: "CountryId",
                table: "ServiceEngineerInfo");

            migrationBuilder.DropColumn(
                name: "Pincode",
                table: "ServiceEngineerInfo");

            migrationBuilder.DropColumn(
                name: "StateId",
                table: "ServiceEngineerInfo");

            migrationBuilder.DropColumn(
                name: "DeliveryChallanId",
                table: "GoodsIssuedReceivedNote");

            migrationBuilder.AddColumn<string>(
                name: "EngineerHomeLocation",
                table: "ServiceEngineerInfo",
                type: "varchar(32)",
                maxLength: 32,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 80,
                column: "BusinessFunctionCode",
                value: "GRN_LIST");

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 81,
                column: "BusinessFunctionCode",
                value: "GRN_CREATE");

            migrationBuilder.UpdateData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 84,
                column: "BusinessFunctionCode",
                value: "DC_CREATE");
        }
    }
}
