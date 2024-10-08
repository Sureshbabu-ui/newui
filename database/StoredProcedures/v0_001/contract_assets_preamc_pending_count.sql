CREATE OR ALTER PROCEDURE [dbo].[contract_assets_preamc_pending_count]
	@ContractId INT,
	@Search VARCHAR(50) = NULL,
	@TotalRows INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		@TotalRows = COUNT(A.Id)
	FROM CustomerSite
	LEFT JOIN Asset A ON A.CustomerSiteId = CustomerSite.Id
	LEFT JOIN ContractAssetDetail CAD ON CAD.AssetId = A.Id
	WHERE 
		CAD.ContractId = @ContractId AND
		CAD.IsPreAmcCompleted = 0 AND
		(@Search IS NULL OR 
		CustomerSite.SiteName LIKE '%' + @Search + '%' OR 
		A.ProductSerialNumber LIKE '%' + @Search + '%')
END