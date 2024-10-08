CREATE OR ALTER PROCEDURE [dbo].[product_details]
	@ProductId INT
AS 
BEGIN 
	SET NOCOUNT ON;
	SELECT
		Id AS ProductId,
		ModelName,
		[Description],
		ManufacturingYear,
		AmcValue,
		AssetProductCategoryId,
		MakeId
	FROM Product
	WHERE 
		Id = @ProductId
	ORDER BY 
		CreatedOn DESC
END