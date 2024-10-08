CREATE OR ALTER PROCEDURE [dbo].[preamc_contracts_count]
	@CustomerId INT = NULL,
	@ContractId INT = NULL,
	@Search VARCHAR(50) = NULL,
	@TotalRows INT OUTPUT,
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
		@TotalRows = COUNT(DISTINCT C.Id)
	FROM 
		ContractAssetDetail CAD
		INNER JOIN Asset A ON A.Id = CAD.AssetId
		INNER JOIN [Contract] C ON C.Id = CAD.ContractId 
		INNER JOIN Customer ON C.CustomerId = Customer.Id
		INNER JOIN CustomerInfo ON CustomerInfo.CustomerId = Customer.Id AND CustomerInfo.EffectiveTo IS NULL
		LEFT JOIN TenantOffice T ON T.Id = A.TenantOfficeId
		LEFT JOIN CustomerSite CS ON A.CustomerSiteId = CS.Id
	WHERE 
		CAD.IsActive = 1 AND C.ContractStatusId =  @ApprovedContractStatus AND CAD.IsPreAmcCompleted = 0 AND
		((@CustomerId IS NULL) OR (@CustomerId IS NOT NULL AND CustomerInfo.Id = @CustomerId) AND
		((@ContractId IS NULL) OR @ContractId IS NOT NULL AND CAD.ContractId = @ContractId)) AND
		(
			@UserCategory = 'UCT_FRHO'
			OR (@UserCategory = 'UCT_CPTV' AND T.Id = @UserOfficeId)
			OR (@UserCategory = 'UCT_FRRO' AND T.RegionId = @UserRegionId)
		) AND
		(@Search IS NULL OR 
		CS.SiteName LIKE '%' + @Search + '%' OR 
		C.ContractNumber LIKE '%' + @Search + '%')
END