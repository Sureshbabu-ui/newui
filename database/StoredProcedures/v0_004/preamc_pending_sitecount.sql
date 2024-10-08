CREATE OR ALTER PROCEDURE [dbo].[preamc_pending_sitecount]
	@CustomerId INT= NULL,
	@ContractId INT= NULL,
	@Page INT = 1,
	@PerPage INT = 10,
	@Search VARCHAR(50) = NULL,
	@UserId INT,
	@TotalRows INT OUTPUT
AS 
BEGIN 
	SET NOCOUNT ON;
	IF @Page < 1
	SET
		@Page = 1;
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
		@TotalRows = COUNT(DISTINCT CS.Id)
	FROM 
		ContractAssetDetail CAD
		INNER JOIN [Contract] C ON CAD.ContractId = C.Id
		INNER JOIN Asset A ON A.Id = CAD.AssetId
		INNER JOIN Customer ON C.CustomerId = Customer.Id
		INNER JOIN CustomerInfo ON CustomerInfo.CustomerId = Customer.Id AND CustomerInfo.EffectiveTo IS NULL
		LEFT JOIN TenantOffice T ON T.Id = A.TenantOfficeId
		INNER JOIN CustomerSite CS ON A.CustomerSiteId = CS.Id 
	WHERE
		CAD.IsActive = 1 AND C.ContractStatusId =  @ApprovedContractStatus AND CAD.IsPreAmcCompleted = 0
		AND (@CustomerId IS NULL OR CustomerInfo.Id = @CustomerId)
		AND (@ContractId IS NULL OR C.Id = @ContractId)
		AND (
			@UserCategory = 'UCT_FRHO'
			OR (@UserCategory = 'UCT_CPTV' AND (T.Id = @UserOfficeId))
			OR (@UserCategory = 'UCT_FRRO' AND T.RegionId = @UserRegionId)
		)AND
		(@Search IS NULL OR 
		CS.SiteName LIKE '%' + @Search + '%')
END