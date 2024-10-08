CREATE OR ALTER PROCEDURE [dbo].[product_get_filtered_model_names]
	 @CategoryId INT,
	 @MakeId INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id,
		ModelName
	FROM Product
	WHERE
		AssetProductCategoryId = @CategoryId AND 
		MakeId = @MakeId
	ORDER BY ModelName ASC;
END 