CREATE OR ALTER   PROCEDURE [dbo].[contractassetsummary_preamc_report] 
	@ContractId INT = NULL,
	@CustomerId INT = NULL,
	@AssetCategoryId INT = NULL,
	@FilterStartDate DATETIME = NULL ,
	@FilterEndDate DATETIME = NULL ,
	@TimeZone VARCHAR(64) = NULL,
	@CustomerSiteId INT = NULL,
	@TenantRegionId INT = NULL,
	@TenantOfficeId INT = NULL,
	@UserId INT
AS 
BEGIN
	DECLARE @ProductGood INT;
	DECLARE @ProductDftv INT;
	DECLARE @ProductNfnd INT;
	DECLARE @FormattedStartDate DATE
	DECLARE @FormattedEndDate DATE
	DECLARE @UserCategory VARCHAR(64);
	DECLARE @UserOfficeId INT;
	DECLARE @UserRegionId INT;

	SELECT @ProductGood = Id FROM MasterEntityData WHERE Code = 'PPC_GOOD'
	SELECT @ProductDftv = Id FROM MasterEntityData WHERE Code = 'PPC_DFTV'
	SELECT @ProductNfnd = Id FROM MasterEntityData WHERE Code = 'PPC_NFND';

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

	WITH ContractAssetDetail_CTE AS
	(
		SELECT 
			CAD.ContractId,
			A.AssetProductCategoryId,
			MIN(CAD.PreAmcCompletedDate) AS PreAmcStartDate,
			COUNT(CASE WHEN IsPreAmcCompleted = 1 THEN 1 END) AS PreAmcCompleteCount,
			COUNT(CASE WHEN ProductConditionId = @ProductGood THEN 1 END) AS AssetsInGoodCondition,
			COUNT(CASE WHEN ProductConditionId = @ProductDftv THEN 1 END) AS AssetsNotInGoodCondition,
			COUNT(CASE WHEN ProductConditionId = @ProductNfnd THEN 1 END) AS AssetsNotFoundInPreAmc,
			COUNT(CASE WHEN IsOutSourcingNeeded = 1 THEN 1 END) AS OutSourcingRequiredCount
		FROM ContractAssetDetail CAD
		LEFT JOIN Asset A ON A.Id = CAD.AssetId
		LEFT JOIN CustomerSite CS ON CS.Id = A.CustomerSiteId
		LEFT JOIN Contract C ON C.Id = CAD.ContractId
		LEFT JOIN TenantOffice T ON T.Id = CS.TenantOfficeId
		LEFT JOIN TenantOffice BL ON BL.Id = C.TenantOfficeId
		WHERE   (@TenantOfficeId IS NULL OR T.Id = @TenantOfficeId)
			AND (
					@UserCategory = 'UCT_FRHO'	OR 
					(@UserCategory = 'UCT_CPTV' AND (T.Id = @UserOfficeId  OR BL.Id = @UserOfficeId))	OR
					(@UserCategory = 'UCT_FRRO' AND (T.RegionId = @UserRegionId OR BL.RegionId = @UserRegionId)) 
				)
			AND (@CustomerSiteId IS NULL OR CS.Id = @CustomerSiteId)
		GROUP BY ContractId, A.AssetProductCategoryId
	)

	SELECT  
		C.ContractNumber,
		CI.Name AS CustomerName,
		T.Code,
		APC.CategoryName,
		CAS.ProductCountAtBooking,
		CADJ.PreAmcStartDate AS PreAmcStartDate,
		ISNULL(CADJ.PreAmcCompleteCount,0)AS PreAmcCompleteCount,
		ISNULL((CADJ.AssetsInGoodCondition + CADJ.AssetsNotInGoodCondition),0) AS AssetsFoundInPreAmc,
		ISNULL(CADJ.AssetsNotFoundInPreAmc,0)AS AssetsNotFoundInPreAmc,
		ISNULL(CADJ.AssetsInGoodCondition,0) AS AssetsInGoodCondition,
		ISNULL(CADJ.AssetsNotInGoodCondition,0)  AS AssetsNotInGoodCondition,
		ISNULL(CADJ.AssetsInGoodCondition + CADJ.AssetsNotInGoodCondition + CADJ.AssetsNotFoundInPreAmc, 0) AS ProductCountUploaded,
		ISNULL((CAS.ProductCountAtBooking - (CADJ.AssetsInGoodCondition + CADJ.AssetsNotInGoodCondition + CADJ.AssetsNotFoundInPreAmc)), 0) AS PendingProductCountToBeUploaded
	FROM ContractAssetSummary CAS
	LEFT JOIN ContractAssetDetail_CTE CADJ ON CADJ.ContractId = CAS.ContractId AND CADJ.AssetProductCategoryId = CAS.AssetProductCategoryId
	LEFT JOIN Contract C ON C.Id = CAS.ContractId 
	LEFT JOIN Customer CUS ON CUS.Id = C.CustomerId
	LEFT JOIN CustomerInfo CI ON CI.CustomerId = CUS.Id 
		AND CI.IsActive = 1 
	LEFT JOIN TenantOffice T ON T.Id = C.TenantOfficeId
	LEFT JOIN AssetProductCategory APC ON APC.Id = CAS.AssetProductCategoryId
	WHERE (CAST(CADJ.PreAmcStartDate AS DATE) BETWEEN CAST(@FormattedStartDate AS DATE) AND CAST(@FormattedEndDate AS DATE))
		AND (@ContractId IS NULL OR C.Id = @ContractId)
		AND (@CustomerId IS NULL OR CI.CustomerId = @CustomerId)
		AND (@AssetCategoryId IS NULL OR APC.Id = @AssetCategoryId)
		AND (@TenantRegionId IS NULL OR T.RegionId = @TenantRegionId)
END
