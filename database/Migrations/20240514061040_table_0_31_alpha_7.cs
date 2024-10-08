using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class table_0_31_alpha_7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ServiceRequestAssignmentId",
                table: "ServiceRequest",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Barcode",
                table: "PartStock",
                type: "varchar(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "varchar(32)",
                oldMaxLength: 32,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Barcode",
                table: "PartReturn",
                type: "nvarchar(32)",
                maxLength: 32,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PartStockId",
                table: "PartReturn",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "WarrantyEndDate",
                table: "PartReturn",
                type: "date",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AppSetting",
                columns: new[] { "Id", "AppKey", "AppValue", "CreatedBy", "CreatedOn", "UpdatedBy", "UpdatedOn" },
                values: new object[] { 24, "LastPartSubCategoryCode", "893", 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null });

            migrationBuilder.InsertData(
                table: "BusinessFunction",
                columns: new[] { "Id", "BusinessFunctionCode", "BusinessFunctionName", "BusinessModuleId", "CreatedBy", "CreatedOn", "Description", "IsActive", "UpdatedBy", "UpdatedOn" },
                values: new object[,]
                {
                    { 110, "SERVICEREQUEST_CALLCORDINATOR_VIEW", "Service Request Call Cordiantor View", 2, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null },
                    { 111, "SERVICEREQUEST_CALLCENTRE_VIEW", "Service Request Call Centre View", 2, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, true, null, null }
                });

            migrationBuilder.InsertData(
                table: "UserLogin",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "DeactivatedBy", "DeactivatedOn", "IsActive", "LastLoginOn", "Passcode", "PasscodeUpdatedOn", "TotalFailedLoginAttempts", "UserName" },
                values: new object[,]
                {
                    { 12638, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "12638" },
                    { 13048, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "13048" },
                    { 13118, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "13118" },
                    { 13242, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "13242" },
                    { 13273, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "13273" },
                    { 13274, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "13274" },
                    { 13372, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "13372" },
                    { 13490, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "13490" },
                    { 13969, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "13969" },
                    { 14027, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "14027" },
                    { 14028, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "14028" },
                    { 14029, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "14029" },
                    { 14030, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "14030" },
                    { 14168, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "14168" },
                    { 14173, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "14173" },
                    { 14174, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "14174" },
                    { 14276, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "14276" },
                    { 14327, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "14327" },
                    { 14381, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "14381" },
                    { 14502, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "14502" },
                    { 20001, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "APTIT079" },
                    { 20002, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "APTIT097" },
                    { 20003, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "APTIT098" },
                    { 90270, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "90270" },
                    { 90391, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, true, null, "uoUJ3wCxmVwufsJX8m2P/X6yxj9T4I20WONYDefyUC0=:hMXvUVtak4vdhsRPL93Pgg==", null, 0, "90391" }
                });

            migrationBuilder.InsertData(
                table: "UserInfo",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "DeletedBy", "DeletedOn", "DepartmentId", "DesignationId", "DivisionId", "Email", "EmployeeCode", "EngagementTypeId", "FullName", "GenderId", "IsActive", "IsDeleted", "ModifiedBy", "ModifiedOn", "Phone", "ReportingManagerId", "TenantOfficeId", "UserCategoryId", "UserLoginId" },
                values: new object[,]
                {
                    { 12638, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "12638", 34, "MOHAMMED SADIQUE P", 20, true, false, null, null, "9447012638", 10, 16, 53, 12638 },
                    { 13048, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "13048", 34, "AKHIL SOORYA M", 20, true, false, null, null, "9447013048", 10, 16, 53, 13048 },
                    { 13118, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "13118", 34, "SARATH LAL K K", 20, true, false, null, null, "9447013118", 10, 16, 53, 13118 },
                    { 13242, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "13242", 34, "ARJUN B", 20, true, false, null, null, "9447013242", 10, 16, 53, 13242 },
                    { 13273, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "13273", 34, "MAHIN ASHRAF", 20, true, false, null, null, "9447013273", 10, 16, 53, 13273 },
                    { 13274, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "13274", 34, "ABDUL SATHAR M", 20, true, false, null, null, "9447013274", 10, 16, 53, 13274 },
                    { 13372, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "13372", 34, "REGIN DAVID", 20, true, false, null, null, "9447013372", 10, 16, 53, 13372 },
                    { 13490, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "13490", 34, "ABHIJITH P S", 20, true, false, null, null, "9447013490", 10, 16, 53, 13490 },
                    { 13969, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "13969", 34, "SANOJ A", 20, true, false, null, null, "9447013969", 10, 16, 53, 13969 },
                    { 14027, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "14027", 34, "SUJITHKUMAR M", 20, true, false, null, null, "9447014027", 10, 16, 53, 14027 },
                    { 14028, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "14028", 34, "NIRPAN C S", 20, true, false, null, null, "9447014028", 10, 16, 53, 14028 },
                    { 14029, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "14029", 34, "AMIL K A", 20, true, false, null, null, "9447014029", 10, 16, 53, 14029 },
                    { 14030, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "14030", 34, "SRAVANTH A S", 20, true, false, null, null, "9447014030", 10, 16, 53, 14030 },
                    { 14168, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "14168", 34, "SHANU SUBRAMANIAN", 20, true, false, null, null, "9447014168", 10, 16, 53, 14168 },
                    { 14173, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "14173", 34, "JINULAL M L", 20, true, false, null, null, "9447014173", 10, 16, 53, 14173 },
                    { 14174, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "14174", 34, "AJEESH C", 20, true, false, null, null, "9447014174", 10, 16, 53, 14174 },
                    { 14276, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "14276", 34, "PRANAV M", 20, true, false, null, null, "9447014276", 10, 16, 53, 14276 },
                    { 14327, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "14327", 34, "PRAMOD M D", 20, true, false, null, null, "9447014327", 10, 16, 53, 14327 },
                    { 14381, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "14381", 34, "ANANDH K A", 20, true, false, null, null, "9447014381", 10, 16, 53, 14381 },
                    { 14502, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "14502", 34, "AKHIL SURESH", 20, true, false, null, null, "9447014502", 10, 16, 53, 14502 },
                    { 20001, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "APTIT079", 34, "THAMEEM", 20, true, false, null, null, "94470APTIT079", 10, 16, 53, 20001 },
                    { 20002, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "APTIT097", 34, "ABHINAV VINOD", 20, true, false, null, null, "94470APTIT097", 10, 16, 53, 20002 },
                    { 20003, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "APTIT098", 34, "MANU MANOJ", 20, true, false, null, null, "94470APTIT098", 10, 16, 53, 20003 },
                    { 90270, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "90270", 34, "AKSHAY C M", 20, true, false, null, null, "9447090270", 10, 16, 53, 90270 },
                    { 90391, 10, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), null, null, 47, 233, 1, "besure_testing@accelits.com", "90391", 34, "AJEESH K V", 20, true, false, null, null, "9447090391", 10, 16, 53, 90391 }
                });

            migrationBuilder.InsertData(
                table: "ServiceEngineerInfo",
                columns: new[] { "Id", "Address", "CityId", "CountryId", "EngineerCategory", "EngineerGeolocation", "EngineerLevel", "EngineerType", "Pincode", "StateId", "UserInfoId" },
                values: new object[,]
                {
                    { 1001, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 12638 },
                    { 1002, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 13048 },
                    { 1003, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 13118 },
                    { 1005, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 13242 },
                    { 1006, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 13273 },
                    { 1007, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 13274 },
                    { 1008, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 13372 },
                    { 1009, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 13490 },
                    { 1010, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 13969 },
                    { 1011, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 14027 },
                    { 1012, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 14028 },
                    { 1013, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 14029 },
                    { 1014, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 14030 },
                    { 1015, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 14168 },
                    { 1016, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 14173 },
                    { 1017, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 14174 },
                    { 1018, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 14276 },
                    { 1019, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 14327 },
                    { 1020, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 14381 },
                    { 1021, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 14502 },
                    { 1024, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 90270 },
                    { 1025, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 90391 },
                    { 1026, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 20001 },
                    { 1027, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 20002 },
                    { 1028, "Cochi", 13, 1, 25, null, 30, 28, null, 2, 20003 }
                });

            migrationBuilder.InsertData(
                table: "UserRole",
                columns: new[] { "Id", "CreatedOn", "RoleId", "UserId" },
                values: new object[,]
                {
                    { 1001, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 12638 },
                    { 1002, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 13048 },
                    { 1003, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 13118 },
                    { 1005, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 13242 },
                    { 1006, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 13273 },
                    { 1007, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 13274 },
                    { 1008, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 13372 },
                    { 1009, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 13490 },
                    { 1010, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 13969 },
                    { 1011, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 14027 },
                    { 1012, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 14028 },
                    { 1013, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 14029 },
                    { 1014, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 14030 },
                    { 1015, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 14168 },
                    { 1016, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 14173 },
                    { 1017, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 14174 },
                    { 1018, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 14276 },
                    { 1019, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 14327 },
                    { 1020, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 14381 },
                    { 1021, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 14502 },
                    { 1024, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 90270 },
                    { 1025, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 90391 },
                    { 1026, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 20001 },
                    { 1027, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 20002 },
                    { 1028, new DateTime(2023, 4, 6, 15, 32, 0, 0, DateTimeKind.Unspecified), 20, 20003 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_PartReturn_PartStockId",
                table: "PartReturn",
                column: "PartStockId");

            migrationBuilder.AddForeignKey(
                name: "FK_PartReturn_PartStock_PartStockId",
                table: "PartReturn",
                column: "PartStockId",
                principalTable: "PartStock",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PartReturn_PartStock_PartStockId",
                table: "PartReturn");

            migrationBuilder.DropIndex(
                name: "IX_PartReturn_PartStockId",
                table: "PartReturn");

            migrationBuilder.DeleteData(
                table: "AppSetting",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 110);

            migrationBuilder.DeleteData(
                table: "BusinessFunction",
                keyColumn: "Id",
                keyValue: 111);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1001);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1002);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1003);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1005);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1006);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1007);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1008);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1009);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1010);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1011);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1012);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1013);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1014);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1015);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1016);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1017);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1018);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1019);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1020);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1021);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1024);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1025);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1026);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1027);

            migrationBuilder.DeleteData(
                table: "ServiceEngineerInfo",
                keyColumn: "Id",
                keyValue: 1028);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1001);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1002);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1003);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1005);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1006);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1007);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1008);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1009);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1010);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1011);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1012);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1013);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1014);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1015);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1016);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1017);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1018);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1019);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1020);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1021);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1024);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1025);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1026);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1027);

            migrationBuilder.DeleteData(
                table: "UserRole",
                keyColumn: "Id",
                keyValue: 1028);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 12638);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13048);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13118);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13242);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13273);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13274);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13372);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13490);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 13969);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14027);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14028);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14029);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14030);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14168);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14173);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14174);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14276);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14327);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14381);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 14502);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 20001);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 20002);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 20003);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 90270);

            migrationBuilder.DeleteData(
                table: "UserInfo",
                keyColumn: "Id",
                keyValue: 90391);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 12638);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 13048);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 13118);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 13242);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 13273);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 13274);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 13372);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 13490);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 13969);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 14027);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 14028);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 14029);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 14030);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 14168);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 14173);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 14174);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 14276);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 14327);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 14381);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 14502);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 20001);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 20002);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 20003);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 90270);

            migrationBuilder.DeleteData(
                table: "UserLogin",
                keyColumn: "Id",
                keyValue: 90391);

            migrationBuilder.DropColumn(
                name: "ServiceRequestAssignmentId",
                table: "ServiceRequest");

            migrationBuilder.DropColumn(
                name: "Barcode",
                table: "PartReturn");

            migrationBuilder.DropColumn(
                name: "PartStockId",
                table: "PartReturn");

            migrationBuilder.DropColumn(
                name: "WarrantyEndDate",
                table: "PartReturn");

            migrationBuilder.AlterColumn<string>(
                name: "Barcode",
                table: "PartStock",
                type: "varchar(32)",
                maxLength: 32,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(32)",
                oldMaxLength: 32);
        }
    }
}
