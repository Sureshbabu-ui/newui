CREATE OR ALTER PROCEDURE [dbo].[contractinterimasset_create] 
	@ContractId INT,
	@CustomerSiteId INT,
	@ProductCategoryId INT,
	@ProductMakeId INT,
	@ProductModelId INT,
	@ProductSerialNumber VARCHAR(32),
	@InterimAssetStatus VARCHAR(8),
	@ReviewRemarks VARCHAR(128) = NULL,
	@CreatedBy int,
	@ContractInterimAssetId INT OUTPUT
AS 
BEGIN 
	SET NOCOUNT ON;

	DECLARE @InterimAssetStatusId INT;
	SELECT @InterimAssetStatusId = Id FROM MasterEntityData WHERE Code = @InterimAssetStatus;
	INSERT INTO ContractInterimAsset
		(
        ContractId,
		CustomerSiteId,
		AssetProductCategoryId,
		ProductMakeId,
		ProductModelId,
		ProductSerialNumber,
		InterimAssetStatusId,
		ReviewRemarks,
		CreatedBy,
		CreatedOn
        )
VALUES
        (
        @ContractId,
		@CustomerSiteId,
		@ProductCategoryId ,
		@ProductMakeId ,
		@ProductModelId ,
		@ProductSerialNumber ,
		@InterimAssetStatusId ,
		@ReviewRemarks ,
		@CreatedBy ,
        GETUTCDATE()
        )
	SET @ContractInterimAssetId = SCOPE_IDENTITY()
END
