CREATE OR ALTER PROCEDURE [dbo].[part_update]
    @PartName VARCHAR(64),
	@HsnCode VARCHAR(8),
    @Id INT,
    @UpdatedBy INT
AS
BEGIN 
	SET NOCOUNT ON;

	UPDATE Part
	SET Part.PartName = @PartName,
		Part.HsnCode = @HsnCode,
		Part.UpdatedBy = @UpdatedBy,
		Part.UpdatedOn = GETUTCDATE(),
		Part.Description = Make.Name +' '+PartProductCategory.CategoryName+ ' '+ PartCategory.Name+ ' ' + ISNULL(PartSubCategory.Name+' ', '')+ @PartName
	FROM Part
		LEFT JOIN Make ON Make.Id=Part.MakeId
		LEFT JOIN PartProductCategory ON PartProductCategory.Id=Part.PartProductCategoryId
		LEFT JOIN PartCategory ON PartCategory.Id=Part.PartCategoryId
		LEFT JOIN PartSubCategory ON PartSubCategory.Id=Part.PartSubCategoryId
	WHERE Part.Id = @Id
END 