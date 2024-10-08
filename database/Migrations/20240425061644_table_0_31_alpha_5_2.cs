using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class table_0_31_alpha_5_2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "VendorBranch",
                keyColumn: "Id",
                keyValue: 1000);

            migrationBuilder.DeleteData(
                table: "VendorInfo",
                keyColumn: "Id",
                keyValue: 1000);

            migrationBuilder.DeleteData(
                table: "Vendor",
                keyColumn: "Id",
                keyValue: 1000);

            migrationBuilder.AlterColumn<bool>(
                name: "IsVerified",
                table: "TenantOfficeInfo",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<decimal>(
                name: "GstRate",
                table: "Part",
                type: "decimal(8,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(16,2)",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "IsVerified",
                table: "TenantOfficeInfo",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "GstRate",
                table: "Part",
                type: "decimal(16,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(8,2)",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "Vendor",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "VendorCode" },
                values: new object[] { 1000, 1, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), "VC1000" });

            migrationBuilder.InsertData(
                table: "VendorBranch",
                columns: new[] { "Id", "Address", "CityId", "Code", "ContactName", "ContactNumberOne", "ContactNumberOneCountryCode", "ContactNumberTwo", "ContactNumberTwoCountryCode", "CountryId", "CreatedBy", "CreatedOn", "CreditPeriodInDays", "DeletedBy", "DeletedOn", "Email", "GstArn", "GstNumber", "GstVendorTypeId", "IsActive", "Name", "Pincode", "Remarks", "StateId", "TenantOfficeId", "TollfreeNumber", "UpdatedBy", "UpdatedOn", "VendorId" },
                values: new object[] { 1000, "Metro Pillar-366, N.M Apartment, Koonamthai, Edappally,Ernakulam, Kerala", 1, "VB1000", "Abdul Basith", "6123451234", "+91", "9012341233", "+91", 1, 1, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 60, null, null, "basith@gmail.com", "1234", "GST99120", 1, true, "Best IINFO Services Edappally", "682024", null, 1, 16, null, null, null, 1000 });

            migrationBuilder.InsertData(
                table: "VendorInfo",
                columns: new[] { "Id", "Address", "ArnNumber", "CinNumber", "CityId", "ContactName", "ContactNumberOne", "ContactNumberOneCountryCode", "ContactNumberTwo", "ContactNumberTwoCountryCode", "CountryId", "CreatedBy", "CreatedOn", "CreditPeriodInDays", "DeletedBy", "DeletedOn", "EffectiveFrom", "EffectiveTo", "Email", "EsiNumber", "GstNumber", "GstVendorTypeId", "IsActive", "IsMsme", "MsmeCommencementDate", "MsmeExpiryDate", "MsmeRegistrationNumber", "Name", "PanNumber", "PanTypeId", "Pincode", "StateId", "TanNumber", "TenantOfficeId", "UpdatedBy", "UpdatedOn", "VendorId" },
                values: new object[] { 1000, "Edappally,Ernakulam", "1234", "1234", 1, "Abdul Basith", "6123451234", "+91", "9012341233", "+91", 1, 3, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 60, null, null, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, "basith@gmail.com", "1234", "GST99120", 1, true, false, null, null, "1234", "Best IINFO Services", "1234", 139, "645565", 1, "1234", 1, null, null, 1000 });
        }
    }
}
