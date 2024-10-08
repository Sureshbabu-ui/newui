CREATE OR ALTER   PROCEDURE [dbo].[make_create]
    @Name VARCHAR(64),
    @CreatedBy INT,
    @IsMakeCreated INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	BEGIN TRANSACTION
	DECLARE @MakeCode VARCHAR(16);
	EXEC dbo.documentnumberformat_get_nextnumber
		@DocumentTypeCode = 'DCT_MKE', 
		@DocumentNumber = @MakeCode OUTPUT

	INSERT INTO Make
		(
		Code,
       	[Name],
		CreatedBy,
		IsActive,
		CreatedOn,
		IsDeleted
		)
  	VALUES 
        ( @MakeCode, 
       	@Name,
		@CreatedBy,
		1,
		GETUTCDATE(),
		0
		)

	SET @IsMakeCreated = 1
	COMMIT TRANSACTION
END
