CREATE OR ALTER PROCEDURE [dbo].[part_details_for_edit]
    @PartId INT
AS
BEGIN 
    SELECT 
        Part.Id,
        Part.PartCode,
        Part.PartName,
        Part.PartCategoryId,
		Part.PartSubCategoryId,
        Part.MakeId,
        Part.HsnCode,
        Part.OemPartNumber,
        Part.PartProductCategoryId
    FROM 
        Part
	WHERE Part.Id = @PartId
END