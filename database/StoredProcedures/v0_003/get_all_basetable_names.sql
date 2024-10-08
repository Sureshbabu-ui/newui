CREATE OR ALTER  PROCEDURE [dbo].[get_all_basetable_names]
AS
BEGIN
    SET NOCOUNT ON;
 
    SELECT TABLE_NAME AS TableName
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_TYPE = 'BASE TABLE'
      AND TABLE_SCHEMA = 'dbo'
    ORDER BY TABLE_NAME;
END;