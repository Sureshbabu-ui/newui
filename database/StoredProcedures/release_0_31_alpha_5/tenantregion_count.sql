CREATE OR ALTER PROCEDURE [dbo].[tenantregion_count]
    @Search        VARCHAR(50) = NULL,
    @TotalRows     INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
        SELECT 
            @TotalRows = COUNT(Id) 
        FROM TenantRegion
        WHERE
            @Search IS NULL OR
            RegionName LIKE '%' + @Search + '%';
END 
