using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class table_v0_005_01 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OutsourcedVendorBranchId",
                table: "ContractAssetDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VendorContractNumber",
                table: "ContractAssetDetail",
                type: "varchar(8)",
                maxLength: 8,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ContractAssetDetail_OutsourcedVendorBranchId",
                table: "ContractAssetDetail",
                column: "OutsourcedVendorBranchId");

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAssetDetail_VendorBranch_OutsourcedVendorBranchId",
                table: "ContractAssetDetail",
                column: "OutsourcedVendorBranchId",
                principalTable: "VendorBranch",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContractAssetDetail_VendorBranch_OutsourcedVendorBranchId",
                table: "ContractAssetDetail");

            migrationBuilder.DropIndex(
                name: "IX_ContractAssetDetail_OutsourcedVendorBranchId",
                table: "ContractAssetDetail");

            migrationBuilder.DropColumn(
                name: "OutsourcedVendorBranchId",
                table: "ContractAssetDetail");

            migrationBuilder.DropColumn(
                name: "VendorContractNumber",
                table: "ContractAssetDetail");
        }
    }
}
