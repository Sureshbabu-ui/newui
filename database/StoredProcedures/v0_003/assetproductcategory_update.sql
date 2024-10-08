CREATE OR ALTER PROCEDURE [dbo].[assetproductcategory_update]
	@Id INT,
    @CategoryName VARCHAR(64),
    @GeneralNotCovered VARCHAR(512),
    @SoftwareNotCovered VARCHAR(512),
    @HardwareNotCovered VARCHAR(512),
    @PartProductCategoryId INT,
	@UpdatedBy INT
AS
BEGIN 
    SET NOCOUNT ON;
  
    Update AssetProductCategory
    SET CategoryName = @CategoryName,
        PartProductCategoryId = @PartProductCategoryId,
        GeneralNotCovered = @GeneralNotCovered,
        SoftwareNotCovered = @SoftwareNotCovered,
        HardwareNotCovered = @HardwareNotCovered,
        UpdatedBy = @UpdatedBy,
        UpdatedOn = GETUTCDATE()
	WHERE Id = @Id
END