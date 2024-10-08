CREATE OR ALTER   PROCEDURE [dbo].[contractasset_bulk_preamcupdate]
	@AssetIdList NVARCHAR(MAX),
    @PreAmcCompletedDate DATETIME,
    @EngineerId INT,
    @ModifiedBy INT
AS 
BEGIN 
SET NOCOUNT ON;
	UPDATE ContractAssetDetail
	SET 
		IsPreAmcCompleted = 1,
		PreAmcCompletedDate = @PreAmcCompletedDate,
		PreAmcCompletedBy = @EngineerId,
		ModifiedBy = @ModifiedBy,
		ModifiedOn = GETUTCDATE()
	FROM ContractAssetDetail CAD
	INNER JOIN Asset ON Asset.Id = CAD.AssetId
	WHERE CAD.Id IN (SELECT CAST((value) AS INT) FROM STRING_SPLIT(@AssetIdList, ','))
END