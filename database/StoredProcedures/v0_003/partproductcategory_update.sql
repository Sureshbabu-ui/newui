CREATE OR ALTER PROCEDURE [dbo].[partproductcategory_update]
    @Id INT,
    @CategoryName VARCHAR(64),
    @Updatedby INT
AS
BEGIN 
	SET NOCOUNT ON;
	UPDATE PartProductCategory
		SET CategoryName = @CategoryName,
		UpdatedBy = @Updatedby,
		UpdatedOn = GETUTCDATE()
	WHERE Id = @Id
END