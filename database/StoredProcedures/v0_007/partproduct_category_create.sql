CREATE OR ALTER     PROCEDURE [dbo].[partproduct_category_create]
    @CategoryName VARCHAR(64),
    @CreatedBy INT
AS
BEGIN 
	SET NOCOUNT ON;
	BEGIN TRANSACTION

	DECLARE @Code VARCHAR(1024);
	EXEC dbo.documentnumberformat_get_nextnumber
		@DocumentTypeCode = 'DCT_PPC', 
		@DocumentNumber = @Code OUTPUT

	INSERT INTO PartProductCategory
		(Code,
        CategoryName,
        CreatedBy,
        CreatedOn)
    VALUES 
        (@Code, 
        @CategoryName,
		@CreatedBy,
		GETUTCDATE())
	COMMIT TRANSACTION
END
