using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace database.Migrations
{
    /// <inheritdoc />
    public partial class sp_0_31_alpha_6_1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //Comment: There is no sp found in this release_0_31_alpha_6_1 folder

            //string storedProcedureFolder = Path.Combine(Directory.GetCurrentDirectory(), "StoredProcedures\\release_0_31_alpha_6_1");
            //string[] storedProcedureFiles = Directory.GetFiles(storedProcedureFolder, "*.sql");
            //foreach (var eachfile in storedProcedureFiles)
            //{
            //    string procedureSql = File.ReadAllText(eachfile);
            //    migrationBuilder.Sql(procedureSql);
            //}

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //Comment: There is no sp found in this release_0_31_alpha_6_1 folder

            //string storedProcedureFolder = Path.Combine(Directory.GetCurrentDirectory(), "StoredProcedures\\release_0_31_alpha_6_1");
            //string[] storedProcedureFiles = Directory.GetFiles(storedProcedureFolder, "*.sql");
            //foreach (var eachfile in storedProcedureFiles)
            //{
            //    // Extract the procedure name from the filename
            //    string procedureName = Path.GetFileNameWithoutExtension(eachfile);
            //    // Drop the stored procedure using its name
            //    migrationBuilder.Sql($"DROP PROCEDURE IF EXISTS {procedureName};");
            //}
        }
    }
}
