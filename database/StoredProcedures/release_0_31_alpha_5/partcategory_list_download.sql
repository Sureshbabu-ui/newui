CREATE OR ALTER PROCEDURE [dbo].[partcategory_list_download]
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        PC.Code,
		PC.[Name] AS CategoryName,
        PartProductCategory.CategoryName AS ProductCategory
    FROM PartCategory PC
	JOIN PartProductCategoryToPartCategoryMapping PPCM On PPCM.PartCategoryId = PC.Id
	JOIN PartProductCategory ON PartProductCategory.Id = PPCM.PartProductCategoryId       
END
