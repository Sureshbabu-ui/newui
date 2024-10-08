CREATE OR ALTER   PROCEDURE [dbo].[product_create]
    @ModelName VARCHAR(64),
    @Description VARCHAR(1024),
    @CategoryId INT,
    @MakeId INT,
    @ManufacturingYear SMALLINT,
    @AmcValue INT,
    @CreatedBy INT,
    @IsProductCreated INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
	BEGIN TRANSACTION

	DECLARE @Code VARCHAR(16);
	EXEC dbo.documentnumberformat_get_nextnumber
		@DocumentTypeCode = 'DCT_PM', 
		@DocumentNumber = @Code OUTPUT

    INSERT INTO Product(
		Code,
        ModelName,
        [Description],
        AssetProductCategoryId,
        MakeId,
		ManufacturingYear,
        AmcValue,
		CreatedBy,
		IsActive,
		CreatedOn,
		IsDeleted
        ) 
	VALUES 
        (@Code,
        @ModelName,
		@Description,
		@CategoryId,
        @MakeId,
		@ManufacturingYear,
        @AmcValue,
		@CreatedBy,
		1,
		GETUTCDATE(),
		0
		)

	SET @IsProductCreated = 1

	COMMIT TRANSACTION
END
