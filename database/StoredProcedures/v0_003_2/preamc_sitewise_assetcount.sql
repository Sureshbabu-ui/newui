CREATE OR ALTER PROCEDURE [dbo].[preamc_sitewise_assetcount]
	@ContractId INT,
	@CustomerSiteId INT = NULL,
	@Search VARCHAR(50) = NULL,
	@TotalRows INT OUTPUT,
	@UserId INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		@TotalRows = COUNT(DISTINCT CS.Id)
	FROM 
		ContractCustomerSite CCS
		INNER JOIN [Contract] C ON CCS.ContractId = C.Id
		INNER JOIN CustomerSite CS ON CCS.CustomerSiteId = CS.Id
		LEFT JOIN Asset A ON A.CustomerSiteId = CS.Id
		LEFT JOIN ContractAssetDetail CAD ON CAD.AssetId = A.Id AND CAD.IsActive = 1
	WHERE
		C.Id = @ContractId
		AND (@CustomerSiteId IS NULL OR A.CustomerSiteId = @CustomerSiteId) AND
		(@Search IS NULL OR 
		CS.SiteName LIKE '%' + @Search + '%')
END