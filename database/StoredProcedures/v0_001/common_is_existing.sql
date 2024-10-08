CREATE OR ALTER PROCEDURE [dbo].[common_is_existing]
    @TableName VARCHAR(32),
    @ColumnName VARCHAR(32),
    @Value VARCHAR(32),
    @Id INT = NULL,
    @Count INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
    
    DECLARE @DynamicSQL NVARCHAR(MAX) = N'
    SELECT @Count = COUNT(Id) FROM ' + QUOTENAME(@TableName) + N' WHERE ' + QUOTENAME(@ColumnName) + N' = @Value';
    
    IF @Id IS NOT NULL
    BEGIN
        SET @DynamicSQL = @DynamicSQL + N' AND Id != @Id';
    END
    
    EXEC sp_executesql @DynamicSQL, N'@Value VARCHAR(32), @Id INT, @Count INT OUTPUT', @Value, @Id, @Count OUTPUT;
END
