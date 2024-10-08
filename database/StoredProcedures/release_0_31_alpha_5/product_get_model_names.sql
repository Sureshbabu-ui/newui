CREATE OR ALTER PROCEDURE [dbo].[product_get_model_names]
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id,
		ModelName 
	FROM Product 
	WHERE 
		IsActive = 1
	ORDER BY ModelName ASC;
END 
