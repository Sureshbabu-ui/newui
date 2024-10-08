CREATE OR ALTER PROCEDURE [dbo].[contract_productcategorypartnotcovered_list]
	@ProductCategoryId VARCHAR(32)
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		PartCategoryId AS Id,
		PC.[Name],
		APCPC.IsActive
	FROM AssetProductCategoryPartNotCovered APCPC
	LEFT JOIN PartCategory PC ON PC.Id=APCPC.PartCategoryId
	WHERE 
		APCPC.AssetProductCategoryId = @ProductCategoryId AND 
		APCPC.IsActive = 1
END 