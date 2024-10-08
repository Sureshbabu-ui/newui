CREATE OR ALTER PROCEDURE [dbo].[preamc_pending_count] 
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

	SELECT
		ISNULL(COUNT(DISTINCT C.Id), 0) AS TotalContract,
		ISNULL(COUNT(DISTINCT CS.Id), 0) AS TotalSite,
		ISNULL(SUM(CASE WHEN CAD.IsPreAmcCompleted = 0 THEN 1 ELSE 0 END), 0) AS PreAmcPendingAssets
	FROM 
		ContractAssetDetail CAD
		INNER JOIN [Contract] C ON CAD.ContractId = C.Id
		INNER JOIN Asset A ON A.Id = CAD.AssetId
		INNER JOIN CustomerInfo ON C.CustomerInfoId = CustomerInfo.Id
		LEFT JOIN TenantOffice T ON T.Id = A.TenantOfficeId
		INNER JOIN CustomerSite CS ON A.CustomerSiteId = CS.Id AND CAD.IsPreAmcCompleted = 0
	WHERE
		CAD.IsActive = 1 AND C.ContractStatusId =  @ApprovedContractStatus
		AND (
			@UserCategory = 'UCT_FRHO'
			OR (@UserCategory = 'UCT_CPTV' AND (T.Id = @UserOfficeId))
			OR (@UserCategory = 'UCT_FRRO' AND T.RegionId = @UserRegionId)
		)
END 