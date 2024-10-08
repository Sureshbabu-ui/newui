CREATE OR ALTER PROCEDURE [dbo].[part_get_names]
	@PartCategoryId VARCHAR(32)
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id,
		PartName
	FROM Part
	WHERE 
		PartCategoryId = @PartCategoryId  AND 
		IsActive=1
	ORDER BY PartName ASC;
END 