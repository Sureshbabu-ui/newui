CREATE OR ALTER PROCEDURE [dbo].[sla_details]
@AssetId	INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT
		IsEnterpriseProduct,
		ResolutionTimeInHours,
		ResponseTimeInHours,
		StandByTimeInHours,
		IsVipProduct
	FROM 
		ContractAssetDetail 
	WHERE
        Id = @AssetId
END