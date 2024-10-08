CREATE OR ALTER PROCEDURE [dbo].[contractassetdetail_preamc_report] 
	@ContractId INT = NULL,
	@CustomerId INT = NULL,
	@TenantRegionId INT = NULL,
	@TenantOfficeId INT = NULL,
	@SiteId INT = NULL,
	@AssetCategoryId INT = NULL,
	@AssetMakeId INT = NULL,
	@AssetModelId INT = NULL,
	@OutSourceServiceRequired INT = NULL,
	@AssetConditionId INT = NULL,
	@FilterStartDate DATETIME = NULL,
	@FilterEndDate DATETIME = NULL,
	@TimeZone VARCHAR(64) = NULL,
	@UserId INT
AS 
BEGIN

	DECLARE @FormattedStartDate DATE
	DECLARE @FormattedEndDate DATE
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

	IF @FilterStartDate IS NULL OR @FilterStartDate = ''
    SET @FilterStartDate = CAST(DATEADD(DAY, -90, GETUTCDATE()) AS DATE); 
    IF @FilterEndDate IS NULL OR @FilterEndDate = ''
    SET @FilterEndDate = CAST(GETUTCDATE() AS DATE);
	SET @FilterEndDate = DATEADD(SECOND, -1, DATEADD(DAY, 1, @FilterEndDate));

	SET @FormattedStartDate = CAST(@FilterStartDate AS DATE);
	SET @FormattedEndDate = CAST(@FilterEndDate AS DATE);

	SELECT 
		T.Code AS BaseLocation,
		C.ContractNumber AS ContractNumber,
		CI.Name AS CustomerName,
		TNT.Code AS MappedLocation,
		CS.SiteName,
		CAD.AssetId AS EquipmentId,
		APC.CategoryName,
		M.Name AS ProductMake,
		P.ModelName AS ProductModel,
		A.ProductSerialNumber,
		CAD.PreAmcCompletedDate
	FROM ContractAssetDetail CAD
	LEFT JOIN Contract C ON C.Id = CAD.ContractId 
	LEFT JOIN Customer CUS ON CUS.Id = C.CustomerId
	LEFT JOIN CustomerInfo CI ON CI.CustomerId = CUS.Id 
		AND CI.IsActive = 1 
	LEFT JOIN TenantOffice T ON T.Id = C.TenantOfficeId
	LEFT JOIN Asset A ON A.Id = CAD.AssetId
	LEFT JOIN Make M ON M.Id = A.ProductMakeId
	LEFT JOIN Product P ON P.Id = A.ProductModelId
	LEFT JOIN CustomerSite CS ON CS.Id = A.CustomerSiteId
	LEFT JOIN AssetProductCategory APC ON APC.Id = A.AssetProductCategoryId
	LEFT JOIN TenantOffice TNT ON TNT.Id = CS.TenantOfficeId
	LEFT JOIN MasterEntityData MED ON MED.Id=CAD.ProductConditionId
	WHERE (CAST(CAD.PreAmcCompletedDate AS DATE) BETWEEN CAST(@FormattedStartDate AS DATE) AND CAST(@FormattedEndDate AS DATE))
		AND (@ContractId IS NULL OR C.Id = @ContractId)
		AND (@CustomerId IS NULL OR CI.CustomerId = @CustomerId)
		AND (@TenantOfficeId IS NULL OR T.Id = @TenantOfficeId)
		AND (
				@UserCategory = 'UCT_FRHO'	OR 
				(@UserCategory = 'UCT_CPTV' AND (TNT.Id = @UserOfficeId  OR T.Id = @UserOfficeId))	OR
				(@UserCategory = 'UCT_FRRO' AND (TNT.RegionId = @UserRegionId OR T.RegionId = @UserRegionId)) 
			)
		AND (@TenantRegionId IS NULL OR T.RegionId = @TenantRegionId)
		AND (@SiteId IS NULL OR CS.Id = @SiteId)
		AND (@AssetCategoryId IS NULL OR APC.Id = @AssetCategoryId)
		AND (@AssetMakeId IS NULL OR M.Id = @AssetMakeId)
		AND (@AssetModelId IS NULL OR P.Id = @AssetModelId)
		AND (@OutSourceServiceRequired IS NULL OR CAD.IsOutSourcingNeeded = @OutSourceServiceRequired)
		AND (@AssetConditionId IS NULL OR CAD.ProductConditionId = @AssetConditionId)
END

