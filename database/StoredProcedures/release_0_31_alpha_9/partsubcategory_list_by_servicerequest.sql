CREATE OR ALTER  PROCEDURE [dbo].[partsubcategory_list_by_servicerequest]
    @AssetProductCategoryId INT,
	@PartCategoryID INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
		PSC.Id,
		PSC.Name
	FROM PartSubCategory PSC
	INNER JOIN PartProductCategoryToPartCategoryMapping PPCM ON PPCM.Id = PSC.PartProductCategoryToPartCategoryMappingId
	WHERE 
		PPCM.PartProductCategoryId = @AssetProductCategoryId AND
		PPCM.PartCategoryId = @PartCategoryId
END