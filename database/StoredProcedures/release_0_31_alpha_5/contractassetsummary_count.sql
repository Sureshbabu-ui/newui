CREATE OR ALTER PROCEDURE [dbo].[contractassetsummary_count]
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT,
    @ContractId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(CAS.Id) 	
    FROM ContractAssetSummary  CAS
    LEFT JOIN AssetProductCategory PC ON CAS.AssetProductCategoryId = PC.Id
    WHERE
        CAS.ContractId = @ContractId AND
        (@Search IS NULL OR 
        PC.CategoryName LIKE '%' + @Search + '%');
END
