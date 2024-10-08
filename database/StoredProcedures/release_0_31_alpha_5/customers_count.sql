CREATE OR ALTER PROCEDURE [dbo].[customers_count]
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(CustomerInfo.Id) 
    FROM CustomerInfo
    WHERE
        EffectiveTo IS NULL AND
        ([Name] LIKE '%' + @Search + '%' OR
        @Search IS NULL);
END
