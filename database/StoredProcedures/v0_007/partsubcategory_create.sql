CREATE OR ALTER   PROCEDURE [dbo].[partsubcategory_create]
    @PartSubCategoryName VARCHAR(64),
    @PartProductCategoryToPartCategoryMappingId INT,
    @CreatedBy INT
  
AS
BEGIN 
	SET NOCOUNT ON;

	DECLARE @Code VARCHAR(16);

	BEGIN TRANSACTION

		EXEC dbo.documentnumberformat_get_nextnumber
			@DocumentTypeCode = 'DCT_PSC', 
			@DocumentNumber = @Code OUTPUT

		INSERT INTO PartSubCategory
			   (
					PartProductCategoryToPartCategoryMappingId,
               		Code,
               		Name,
				
               		CreatedBy,
					IsActive,
               		CreatedOn
                  
               )
           		VALUES 
				(
					@PartProductCategoryToPartCategoryMappingId,
               		@Code,
               		@PartSubCategoryName,
		             @CreatedBy,
					1,
               		GETUTCDATE()
               )
COMMIT TRANSACTION
END 

