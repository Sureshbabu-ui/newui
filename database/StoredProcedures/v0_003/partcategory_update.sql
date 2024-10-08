CREATE OR ALTER PROCEDURE [dbo].[partcategory_update]
	@Id INT,
    @Name VARCHAR(64),
	@PartProductCategoryId INT,
	@MappingId INT,
    @UpdatedBy INT
AS
BEGIN 
	SET NOCOUNT ON;
	SET XACT_ABORT ON; 
	BEGIN TRANSACTION

	UPDATE PartCategory 
		SET [Name] = @Name ,
		UpdatedBy = @UpdatedBy,
		UpdatedOn = GETUTCDATE()
	WHERE Id = @Id
	
	UPDATE PartProductCategoryToPartCategoryMapping
	SET PartProductCategoryId = @PartProductCategoryId,
		UpdatedBy = @UpdatedBy,
		UpdatedOn = GETUTCDATE()
		WHERE PartCategoryId = @Id AND Id = @MappingId

	COMMIT TRANSACTION;
END