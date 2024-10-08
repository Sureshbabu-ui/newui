using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class table_v0_007_01 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {


            migrationBuilder.DropForeignKey(
                name: "FK_PostalCode_TenantOffice_TenantOfficeId",
                table: "PostalCode");

            migrationBuilder.DropTable(
                name: "BusinessSetting");

            migrationBuilder.DropIndex(
                name: "IX_PostalCode_TenantOfficeId",
                table: "PostalCode");

            migrationBuilder.DropColumn(
                name: "TenantOfficeId",
                table: "PostalCode");

            migrationBuilder.AddColumn<int>(
                name: "TenantOfficeId",
                table: "City",
                type: "int",
                nullable: true);




            migrationBuilder.InsertData(
                table: "MasterEntityData",
                columns: new[] { "Id", "Code", "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "IsActive", "IsDeleted", "MasterEntityId", "ModifiedBy", "ModifiedOn", "Name" },
                values: new object[] { 345, "DCT_PAMC", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, false, 63, null, null, "Pre AMC Schedule Number" });

            migrationBuilder.InsertData(
                table: "DocumentNumberFormat",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "DocumentTypeId", "Format", "ModifiedBy", "ModifiedOn", "NumberPadding" },
                values: new object[] { 22, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 345, "PAMC{NOSPACE}{LOC}{NOSPACE}{YYYY}-{NUM}", null, null, 4 });

            migrationBuilder.InsertData(
                table: "DocumentNumberSeries",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "DocumentNumberFormatId", "DocumentTypeId", "ModifiedBy", "ModifiedOn", "RegionId", "StateId", "TenantOfficeId", "TenantRegionId", "Year" },
                values: new object[,]
                {
                    { 575, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 2, null, "2425" },
                    { 576, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 3, null, "2425" },
                    { 577, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 4, null, "2425" },
                    { 578, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 5, null, "2425" },
                    { 579, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 6, null, "2425" },
                    { 580, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 7, null, "2425" },
                    { 581, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 8, null, "2425" },
                    { 582, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 9, null, "2425" },
                    { 583, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 10, null, "2425" },
                    { 584, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 11, null, "2425" },
                    { 585, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 12, null, "2425" },
                    { 586, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 13, null, "2425" },
                    { 587, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 14, null, "2425" },
                    { 588, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 15, null, "2425" },
                    { 589, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 16, null, "2425" },
                    { 590, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 17, null, "2425" },
                    { 591, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 18, null, "2425" },
                    { 592, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 19, null, "2425" },
                    { 593, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 20, null, "2425" },
                    { 594, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 21, null, "2425" },
                    { 595, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 22, null, "2425" },
                    { 596, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 23, null, "2425" },
                    { 597, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 24, null, "2425" },
                    { 598, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 25, null, "2425" },
                    { 599, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 26, null, "2425" },
                    { 600, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 27, null, "2425" },
                    { 601, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 28, null, "2425" },
                    { 602, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 29, null, "2425" },
                    { 603, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 30, null, "2425" },
                    { 604, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 31, null, "2425" },
                    { 605, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 32, null, "2425" },
                    { 606, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 33, null, "2425" },
                    { 607, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 34, null, "2425" },
                    { 608, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 35, null, "2425" },
                    { 609, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 36, null, "2425" },
                    { 610, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 37, null, "2425" },
                    { 611, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 38, null, "2425" },
                    { 612, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 39, null, "2425" },
                    { 613, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 40, null, "2425" },
                    { 614, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 41, null, "2425" },
                    { 615, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 42, null, "2425" },
                    { 616, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 43, null, "2425" },
                    { 617, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 44, null, "2425" },
                    { 618, 10, new DateTime(2024, 4, 16, 10, 10, 10, 0, DateTimeKind.Unspecified), 22, 345, null, null, null, null, 1, null, "2425" }
                });
            migrationBuilder.CreateIndex(
                name: "IX_City_TenantOfficeId",
                table: "City",
                column: "TenantOfficeId");

            migrationBuilder.AddForeignKey(
                name: "FK_City_TenantOffice_TenantOfficeId",
                table: "City",
                column: "TenantOfficeId",
                principalTable: "TenantOffice",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropForeignKey(
            //    name: "FK_City_TenantOffice_TenantOfficeId",
            //    table: "City");

            //migrationBuilder.DropIndex(
            //    name: "IX_City_TenantOfficeId",
            //    table: "City");
            //    table: "City");

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 575);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 576);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 577);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 578);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 579);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 580);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 581);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 582);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 583);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 584);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 585);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 586);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 587);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 588);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 589);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 590);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 591);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 592);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 593);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 594);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 595);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 596);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 597);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 598);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 599);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 600);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 601);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 602);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 603);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 604);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 605);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 606);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 607);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 608);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 609);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 610);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 611);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 612);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 613);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 614);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 615);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 616);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 617);

            migrationBuilder.DeleteData(
                table: "DocumentNumberSeries",
                keyColumn: "Id",
                keyValue: 618);

            migrationBuilder.DeleteData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "MasterEntityData",
                keyColumn: "Id",
                keyValue: 345);

            migrationBuilder.DropColumn(
                name: "TenantOfficeId",
                table: "City");

            migrationBuilder.AddColumn<int>(
                name: "TenantOfficeId",
                table: "PostalCode",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "BusinessSetting",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ContractNumberFormat = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    CustomerNumberFormat = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    DebitNoteNumberFormat = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    InvoiceNumberFormat = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    ReceiptNumberFormat = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    WorkOrderNumberFormat = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessSetting", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "BusinessSetting",
                columns: new[] { "Id", "ContractNumberFormat", "CustomerNumberFormat", "DebitNoteNumberFormat", "InvoiceNumberFormat", "ReceiptNumberFormat", "WorkOrderNumberFormat" },
                values: new object[] { 1, "ACC/{LOC}/{YYYY}/{SNO}", " DIV/LOC/YYYY/$SNO", "ACC/{LOC}/{YYYY}/{SNO}", "ACI/{LOC}/{YY}{SNO}", "ACC/{LOC}/{YYYY}/{SNO}", "DIV/LOC/YYYY/$SNO" });

            migrationBuilder.UpdateData(
                table: "DocumentNumberFormat",
                keyColumn: "Id",
                keyValue: 21,
                column: "Format",
                value: "PMSN-{LOC}{NOSPACE}{YYYY}-{NUM}");

            migrationBuilder.CreateIndex(
                name: "IX_PostalCode_TenantOfficeId",
                table: "PostalCode",
                column: "TenantOfficeId");

            migrationBuilder.AddForeignKey(
                name: "FK_PostalCode_TenantOffice_TenantOfficeId",
                table: "PostalCode",
                column: "TenantOfficeId",
                principalTable: "TenantOffice",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
