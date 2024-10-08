CREATE OR ALTER PROCEDURE [dbo].[contractassetsummary_create]
    @ContractId INT,
	@ProductCategoryId INT,
	@PartCategoryId VARCHAR(128)=NULL,
	@ProductCount INT,
	@AmcValue DECIMAL(16,2),
	@CreatedBy INT
AS
BEGIN 
	DECLARE @Start		INT=1;
	DECLARE @Length		INT=0;
	DECLARE @PartCategory INT;
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
	BEGIN TRANSACTION

    INSERT INTO ContractAssetSummary(
        ContractId,
        AssetProductCategoryId,
        ProductCountAtBooking,
        AmcValue,
        CreatedBy,
        CreatedOn
    )
    VALUES
    (
        @ContractId,
        @ProductCategoryId,
        @ProductCount,
        @AmcValue,
        @CreatedBy,
        GETUTCDATE()
    )

    -- Separate each partcategoryId from the string
    IF @PartCategoryId IS NOT NULL AND @PartCategoryId != ''
    BEGIN
        SET @PartCategoryId = @PartCategoryId + ',';
        WHILE (@Start <= LEN(@PartCategoryId))
        BEGIN
            SET @Length = (CHARINDEX(',', @PartCategoryId, @Start) - @Start);
            SET @PartCategory = SUBSTRING(@PartCategoryId, @Start, @Length);

            -- Insert each part category into ContractProductCategoryPartNotCovered
            INSERT INTO ContractProductCategoryPartNotCovered(ContractId, AssetProductCategoryId, PartCategoryId, CreatedBy, CreatedOn)
            VALUES (@ContractId, @ProductCategoryId, @PartCategory, @CreatedBy, GETUTCDATE());

            SET @Start = (CHARINDEX(',', @PartCategoryId, @Start) + 1);
        END
    END
    COMMIT TRANSACTION;
END