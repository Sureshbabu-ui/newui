CREATE OR ALTER PROCEDURE [dbo].[product_count]
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT
        @TotalRows = COUNT(Product.Id)
    FROM Product
    WHERE
        Product.IsDeleted = 0 AND
         (@Search IS NULL OR
         (Product.ModelName LIKE '%' + @Search + '%' OR 
         Product.Code LIKE '%' + @Search + '%'));
END
