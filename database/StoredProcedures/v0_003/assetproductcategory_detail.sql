CREATE OR ALTER PROCEDURE [dbo].[assetproductcategory_detail]
	@ProductCategoryId INT
AS 
BEGIN 
	SET NOCOUNT ON;
	SELECT
		APC.Id,
		APC.Code,
		APC.PartProductCategoryId,
		APC.CategoryName,
		PPC.CategoryName AS PartProductCategory,
        APC.GeneralNotCovered,
        APC.SoftwareNotCovered,
		APC.HardwareNotCovered
	FROM AssetProductCategory APC
    LEFT JOIN PartProductCategory PPC ON PPC.Id = APC.PartProductCategoryId
	WHERE 
		APC.Id = @ProductCategoryId
	ORDER BY APC.CreatedOn DESC
END 