CREATE OR ALTER PROCEDURE [dbo].[tenants_count]
    @Search    VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(TenantInfo.Id) 
    FROM TenantInfo
    WHERE
        @Search IS NULL OR
        TenantInfo.[Name] LIKE '%' + @Search + '%';
END 

