CREATE OR ALTER PROCEDURE [dbo].[contractproductcategorypartsnotcovered_selected_list] 
	@ProductCategoryId INT,
	@ContractId INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		CCAPC.PartCategoryId AS PartCategoryList,
		PC.[Name] AS PartCategoryNames
	FROM ContractProductCategoryPartNotCovered CCAPC
	LEFT JOIN PartCategory PC ON PC.Id=CCAPC.PartCategoryId
	WHERE 
		CCAPC.AssetProductCategoryId = @ProductCategoryId AND
		CCAPC.ContractId = @ContractId AND
		CCAPC.IsDeleted = 0
	GROUP BY
		CCAPC.PartCategoryId,
		PC.[Name]
END