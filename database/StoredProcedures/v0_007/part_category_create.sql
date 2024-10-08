CREATE OR ALTER   PROCEDURE [dbo].[part_category_create]
    @Name VARCHAR(64),
	@ProductCategoryId VARCHAR(128),
    @CreatedBy INT
AS
BEGIN 
	SET NOCOUNT ON;
	SET XACT_ABORT ON; 
	BEGIN TRANSACTION

	DECLARE @start		INT=1;
	DECLARE @length		INT=0;
	DECLARE @CategoryId	INT;
    DECLARE @LastInsertedId INT;
	DECLARE @Code VARCHAR(16);
	EXEC dbo.documentnumberformat_get_nextnumber
		@DocumentTypeCode = 'DCT_PCC', 
		@DocumentNumber = @Code OUTPUT

	INSERT INTO PartCategory 
		(Code,
		[Name],
		CreatedBy,
		CreatedOn,
		IsActive) 
	VALUES
		(@Code,
		@Name,
		@CreatedBy,
		SYSUTCDATETIME(),
		1);
	SET @LastInsertedId = SCOPE_IDENTITY()

	SET @ProductCategoryId = @ProductCategoryId+',';
	WHILE(@start <= LEN(@ProductCategoryId))
	BEGIN
		SET @length = (CHARINDEX(',', @ProductCategoryId, @start) - @start);
		SET @CategoryId = SUBSTRING(@ProductCategoryId, @start, @length);

		INSERT INTO PartProductCategoryToPartCategoryMapping
			(PartCategoryId,
			PartProductCategoryId,
			CreatedBy,
			CreatedOn,
			IsActive) 
		VALUES
			(@LastInsertedId,
			@CategoryId,
			@CreatedBy,
			SYSUTCDATETIME(),
			1)
		SET @start	= (CHARINDEX(',', @ProductCategoryId, @start) + 1);
	END
	COMMIT TRANSACTION;
END
