CREATE OR ALTER  PROCEDURE [dbo].[contractassets_getall_preamcpending_list] 
	@CustomerId INT = NULL,
	@ContractId INT = NULL,
	@CustomerSiteId INT = NULL,
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
		CAD.Id,
		C.ContractNumber,
		CustomerInfo.NameOnPrint AS CustomerName,
		A.CustomerSiteId,
		T.OfficeName AS [Location],
		A.MspAssetId,
		PC.CategoryName,
		M.[Name] AS ProductMake,
		P.ModelName,
		A.ProductSerialNumber,
		CS.SiteName AS CustomerSiteName,
		MED.[Name] AssetAddedMode,
		PC.CategoryName AS AssetProductCategoryName,
		CAD.IsOutSourcingNeeded,
		VB.[Name] AS VendorBranch
	FROM ContractAssetDetail CAD
		LEFT JOIN Asset A ON A.Id = CAD.AssetId
		INNER JOIN Contract C ON C.Id = CAD.ContractId
		LEFT JOIN TenantOffice T ON T.Id = A.TenantOfficeId
		LEFT JOIN CustomerSite CS ON A.CustomerSiteId = CS.Id
		LEFT JOIN AssetProductCategory PC ON A.AssetProductCategoryId = PC.Id
		LEFT JOIN Make M ON A.ProductMakeId = M.Id
		LEFT JOIN Product P ON A.ProductModelId = P.Id
		INNER JOIN Customer ON CS.CustomerId = Customer.Id
		INNER JOIN CustomerInfo ON CustomerInfo.CustomerId = Customer.Id AND CustomerInfo.EffectiveTo IS NULL
		INNER JOIN MasterEntityData MED ON MED.Id = CAD.AssetAddModeId
		LEFT JOIN VendorBranch VB ON VB.Id = CAD.OutsourcedVendorBranchId
	WHERE
		CAD.IsActive = 1 AND CAD.IsPreAmcCompleted = 0 AND 
		((@CustomerId IS NULL) OR (@CustomerId IS NOT NULL AND CustomerInfo.Id = @CustomerId) AND
		((@ContractId IS NULL) OR @ContractId IS NOT NULL AND CAD.ContractId = @ContractId) AND
		((@CustomerSiteId IS NULL) OR @CustomerSiteId IS NOT NULL AND A.CustomerSiteId = @CustomerSiteId)) AND
		(
			@UserCategory = 'UCT_FRHO'
			OR (@UserCategory = 'UCT_CPTV' AND T.Id = @UserOfficeId)
			OR (@UserCategory = 'UCT_FRRO' AND T.RegionId = @UserRegionId)
		) AND
		(@Search IS NULL OR 
		CS.SiteName LIKE '%' + @Search + '%' OR 
		A.ProductSerialNumber LIKE '%' + @Search + '%')
	ORDER BY
		CAD.Id DESC OFFSET (@Page -1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY
END 