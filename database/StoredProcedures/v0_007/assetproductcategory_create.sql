CREATE OR ALTER   PROCEDURE [dbo].[assetproductcategory_create]
    @CategoryName VARCHAR(64),
    @CreatedBy INT,
    @GeneralNotCovered VARCHAR(512),
    @SoftwareNotCovered VARCHAR(512),
    @HardwareNotCovered VARCHAR(512),
    @PartProductCategoryId INT
AS
BEGIN 
    SET NOCOUNT ON;
    BEGIN TRANSACTION

	DECLARE @APCCode VARCHAR(16)
	EXEC dbo.documentnumberformat_get_nextnumber
			@DocumentTypeCode = 'DCT_APC', 
			@DocumentNumber = @APCCode OUTPUT

    INSERT INTO AssetProductCategory
        (Code,
        CategoryName,
        PartProductCategoryId,
        GeneralNotCovered,
        SoftwareNotCovered,
        HardwareNotCovered,
        CreatedBy,
        CreatedOn)
    VALUES 
        (@APCCode, 
        @CategoryName,
        @PartProductCategoryId,
        @GeneralNotCovered,
        @SoftwareNotCovered,
        @HardwareNotCovered,
        @CreatedBy,
        GETUTCDATE());

    COMMIT TRANSACTION
END
