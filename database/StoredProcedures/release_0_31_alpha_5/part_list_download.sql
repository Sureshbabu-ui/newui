CREATE OR ALTER    PROCEDURE [dbo].[part_list_download]
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        Part.PartCode,
        Part.PartName,
        PC.Name AS PartCategoryName,
        M.Name AS MakeName,
        Part.HsnCode,
        Part.OemPartNumber,
        Part.Description,
        PartProductCategory.CategoryName AS ProductCategoryName
    FROM 
        Part
        LEFT JOIN PartCategory AS PC ON PC.Id = Part.PartCategoryId
        LEFT JOIN Make AS M ON M.Id = Part.MakeId
        LEFT JOIN PartProductCategory ON PartProductCategory.Id=Part.PartProductCategoryId;
END