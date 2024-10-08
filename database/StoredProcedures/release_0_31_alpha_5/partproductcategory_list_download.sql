CREATE OR ALTER PROCEDURE [dbo].[partproductcategory_list_download]
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        PartProductCategory.Code,
        PartProductCategory.CategoryName
    FROM PartProductCategory     
END