CREATE OR ALTER   PROCEDURE [dbo].[preamc_sitewise_assetlist] 
	@ContractId INT,
	@CustomerSiteId INT = NULL,
	@Page INT = 1,
	@PerPage INT = 10,
	@Search VARCHAR(50) = NULL,
	@UserId INT
AS 
BEGIN 
	SET NOCOUNT ON;
	IF @Page < 1
	SET
		@Page = 1;
	SELECT
		CS.SiteName,
		CS.Id AS SIteId,
		COUNT(DISTINCT A.Id) AS TotalAsset,
		SUM(CASE WHEN CAD.IsPreAmcCompleted = 0 THEN 1 ELSE 0 END) AS PreAmcPendingAssets,
		SUM(CASE WHEN CAD.IsPreAmcCompleted = 1 THEN 1 ELSE 0 END) AS PreAmcCompletedAssets
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
	GROUP BY
		CS.SiteName,
		CS.Id
	ORDER BY
		CS.Id DESC
		OFFSET (@Page -1) * @PerPage ROWS 
		FETCH NEXT @PerPage ROWS ONLY;
END 