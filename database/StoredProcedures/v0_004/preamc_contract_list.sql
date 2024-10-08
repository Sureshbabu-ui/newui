CREATE OR ALTER   PROCEDURE [dbo].[preamc_contract_list] 
	@CustomerId INT = NULL,
	@ContractId INT = NULL,
	@Page INT = 1,
	@PerPage INT = 10,
	@Search VARCHAR(50) = NULL,
	@UserId INT
AS 
BEGIN 
	SET NOCOUNT ON;
	DECLARE @UserCategory VARCHAR(64);
	DECLARE @UserOfficeId INT;
	DECLARE @UserRegionId INT;
	DECLARE @ApprovedContractStatus INT;
	SELECT @ApprovedContractStatus = Id FROM MasterEntityData WHERE Code = 'CTS_APRV'
	SELECT
        @UserCategory = MED.Code,
        @UserOfficeId = UserInfo.TenantOfficeId,
		@UserRegionId = TenantOffice.RegionId
    FROM UserInfo
        LEFT JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
        LEFT JOIN MasterEntityData MED ON UserInfo.UserCategoryId = MED.Id
    WHERE
        UserInfo.Id = @UserId;

	IF @Page < 1
	SET
		@Page = 1;
	SELECT
		C.ContractNumber,
		C.Id AS ContractId,
		CustomerInfo.Name AS CustomerName,
		COUNT(DISTINCT CS.Id) AS TotalSite,
		COUNT(DISTINCT A.Id) AS TotalAsset,
		SUM(CASE WHEN CAD.IsPreAmcCompleted = 0 THEN 1 ELSE 0 END) AS PreAmcPendingAssets,
		SUM(CASE WHEN CAD.IsPreAmcCompleted = 1 THEN 1 ELSE 0 END) AS PreAmcCompletedAssets
	FROM 
		[Contract] C
		LEFT JOIN ContractAssetDetail CAD ON C.Id = CAD.ContractId
		INNER JOIN Asset A ON A.Id = CAD.AssetId
		INNER JOIN Customer ON C.CustomerId = Customer.Id
		INNER JOIN CustomerInfo ON CustomerInfo.CustomerId = Customer.Id AND CustomerInfo.EffectiveTo IS NULL
		LEFT JOIN TenantOffice T ON T.Id = A.TenantOfficeId
		LEFT JOIN CustomerSite CS ON A.CustomerSiteId = CS.Id
	WHERE
		CAD.IsActive = 1 AND C.ContractStatusId =  @ApprovedContractStatus AND CAD.IsPreAmcCompleted = 0
		AND (@CustomerId IS NULL OR CustomerInfo.Id = @CustomerId)
		AND (@ContractId IS NULL OR CAD.ContractId = @ContractId)
		AND (
			@UserCategory = 'UCT_FRHO'
			OR (@UserCategory = 'UCT_CPTV' AND (T.Id = @UserOfficeId))
			OR (@UserCategory = 'UCT_FRRO' AND T.RegionId = @UserRegionId)
		) AND
		(@Search IS NULL OR 
		CS.SiteName LIKE '%' + @Search + '%' OR 
		C.ContractNumber LIKE '%' + @Search + '%')
	GROUP BY
		C.ContractNumber,
		C.Id,
		CustomerInfo.Name 
		ORDER BY
		C.Id DESC
		OFFSET (@Page -1) * @PerPage ROWS 
		FETCH NEXT @PerPage ROWS ONLY;
END 