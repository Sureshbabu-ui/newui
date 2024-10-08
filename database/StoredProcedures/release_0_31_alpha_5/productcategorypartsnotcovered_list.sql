CREATE OR ALTER PROCEDURE [dbo].[productcategorypartnotcovered_list]
	@ProductCategoryId VARCHAR(32)
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT CONCAT(PartCategoryId,'.',APCPNC.IsActive) AS ProductCategoryPartNotCovered
	FROM AssetProductCategoryPartNotCovered APCPNC
	LEFT JOIN AssetProductCategory APC ON APC.Id=APCPNC.AssetProductCategoryId
	WHERE 
		APCPNC.IsActive=1 AND 
		AssetProductCategoryId = @ProductCategoryId
END