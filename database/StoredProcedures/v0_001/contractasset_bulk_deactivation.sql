CREATE OR ALTER   PROCEDURE [dbo].[contractasset_bulk_deactivation]
	@AssetIdList NVARCHAR(MAX),
    @ModifiedBy INT
AS 
BEGIN 
SET NOCOUNT ON;
	UPDATE ContractAssetDetail
	SET 
		IsActive = 0,
		ModifiedBy = @ModifiedBy,
		ModifiedOn = GETUTCDATE()
	FROM ContractAssetDetail CAD
	INNER JOIN Asset ON Asset.Id = CAD.AssetId
	WHERE CAD.Id IN (SELECT CAST((value) AS INT) FROM STRING_SPLIT(@AssetIdList, ','))
END