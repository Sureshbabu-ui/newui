CREATE OR ALTER PROCEDURE [dbo].[contractassets_getall_preamcpending_count]
	@CustomerId INT = NULL,
	@ContractId INT = NULL,
	@CustomerSiteId INT = NULL,
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
	-- Approved Contract Status Id
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
		@TotalRows = COUNT(A.Id)
	FROM CustomerSite
	LEFT JOIN Asset A ON A.CustomerSiteId = CustomerSite.Id
	LEFT JOIN CustomerSite CS ON A.CustomerSiteId = CS.Id
	INNER JOIN Customer ON CS.CustomerId = Customer.Id
	INNER JOIN CustomerInfo ON CustomerInfo.CustomerId = Customer.Id AND CustomerInfo.EffectiveTo IS NULL
	LEFT JOIN TenantOffice T ON T.Id = A.TenantOfficeId
	LEFT JOIN ContractAssetDetail CAD ON CAD.AssetId = A.Id
	INNER JOIN [Contract] C ON C.Id = CAD.ContractId 
	WHERE 
		CAD.IsActive = 1 AND CAD.IsPreAmcCompleted = 0 AND C.ContractStatusId =  @ApprovedContractStatus AND
		((@CustomerId IS NULL) OR (@CustomerId IS NOT NULL AND CustomerInfo.Id = @CustomerId) AND
		((@ContractId IS NULL) OR @ContractId IS NOT NULL AND CAD.ContractId = @ContractId) AND
		((@CustomerSiteId IS NULL) OR @CustomerSiteId IS NOT NULL AND A.CustomerSiteId = @CustomerSiteId)) AND
		(
			@UserCategory = 'UCT_FRHO'
			OR (@UserCategory = 'UCT_CPTV' AND T.Id = @UserOfficeId)
			OR (@UserCategory = 'UCT_FRRO' AND T.RegionId = @UserRegionId)
		) AND
		(@Search IS NULL OR 
		CustomerSite.SiteName LIKE '%' + @Search + '%' OR 
		A.ProductSerialNumber LIKE '%' + @Search + '%')
END