CREATE OR ALTER PROCEDURE [dbo].[assetproductcategory_create]
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
    DECLARE @Code VARCHAR(1024);

	DECLARE @AssetProductCategoryPrefix VARCHAR(1024); -- TODO: This hardcoded value should replaced with actual value from appsettings
	SET @AssetProductCategoryPrefix = 'R';

    UPDATE AppSetting SET @Code = AppValue = AppValue + 1
    WHERE AppKey = 'LastAssetProductCategoryCode';

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
        (@AssetProductCategoryPrefix + RIGHT('000' + CAST((@Code) AS VARCHAR(6)), 3), 
        @CategoryName,
        @PartProductCategoryId,
        @GeneralNotCovered,
        @SoftwareNotCovered,
        @HardwareNotCovered,
        @CreatedBy,
        GETUTCDATE());

    COMMIT TRANSACTION
END