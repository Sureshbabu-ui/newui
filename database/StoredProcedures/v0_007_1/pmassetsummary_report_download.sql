CREATE OR ALTER PROCEDURE [dbo].[pmassetsummary_report_download]
    @TimeZone VARCHAR(64),
    @StatusType VARCHAR(64) ='ALL',
    @DateFrom VARCHAR(64) = NULL,
    @DateTo VARCHAR(64) = NULL,
    @TenantRegionId INT = NULL,
    @TenantOfficeId INT = NULL,
	@CustomerId INT = NULL,
	@ContractId INT NULL,
	@UserId INT
AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @UserCategory VARCHAR(64);
	DECLARE @UserOfficeId INT;
	DECLARE @UserRegionId INT;
DECLARE @DateFormat VARCHAR(16) = 'dd-MM-yyyy'

	SELECT
        @UserCategory = MED.Code,
        @UserOfficeId = UserInfo.TenantOfficeId,
		@UserRegionId = TenantOffice.RegionId
    FROM UserInfo
        LEFT JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
        LEFT JOIN MasterEntityData MED ON UserInfo.UserCategoryId = MED.Id
    WHERE
        UserInfo.Id = @UserId;

	IF @DateFrom IS NULL OR @DateFrom = ''
    SET @DateFrom = DATEFROMPARTS(YEAR(GETUTCDATE()), MONTH(GETUTCDATE()), 1);
    IF @DateTo IS NULL OR @DateTo = ''
    SET @DateTo = CAST(GETUTCDATE() AS DATE);
	SET @DateTo = DATEADD(SECOND, -1, DATEADD(DAY, 1, @DateTo));

	WITH ContractAssetPmDetail_CTE AS
	(
		SELECT 
			CAD.ContractId,
			A.AssetProductCategoryId,
			A.CustomerSiteId,
			CAPD.PmDate,
			COUNT(CAPD.Id) AS TotalCount,
			COUNT(CASE WHEN CAPD.PmDate IS NOT NULL THEN 1 ELSE NULL END) AS PMCompletedCount,
			COUNT(CASE WHEN CAPD.PmDate IS NULL THEN 1 ELSE NULL END) AS PMNotCompletedCount
		FROM ContractAssetPmDetail CAPD
			LEFT JOIN ContractAssetDetail CAD ON CAPD.ContractAssetDetailId = CAD.Id
			LEFT JOIN Asset A ON A.Id = CAD.AssetId
		WHERE CAPD.PmDate BETWEEN CAST(@DateFrom AS DATE) AND CAST(@DateTo AS DATE)
		GROUP BY CAD.ContractId, A.AssetProductCategoryId, CAPD.PmDate,A.CustomerSiteId
	)

	SELECT 
		TR.RegionName,
		BL.OfficeName BaseLocation,
		ML.OfficeName MappedLocation,
		CG.GroupName +'(' + CG.GroupCode + ')' GroupName,
		CI.NameOnPrint CustomerName,
		C.ContractNumber,
		CS.SiteName,
		CI.NameOnPrint CustomerName,
		C.ContractNumber,
		CS.SiteName,
		APC.CategoryName,
		CAPD.PmDate AS PmScheduledDate ,
		CAPD.PMNotCompletedCount,
		CAPD.PMCompletedCount,
		CAPD.PMCompletedCount + CAPD.PMNotCompletedCount TotalCount
	FROM ContractAssetPmDetail_CTE   CAPD
		LEFT JOIN [Contract] C ON C.Id = CAPD.ContractId
		INNER JOIN CustomerSite CS ON CS.Id = CAPD.CustomerSiteId
		LEFT JOIN TenantOffice ML ON ML.Id =CS.TenantOfficeId
		LEFT JOIN Customer CR ON CR.Id =C.CustomerId
		LEFT JOIN CustomerInfo CI on CI.CustomerId = C.CustomerId AND CI.EffectiveTo IS NULL
		LEFT JOIN CustomerGroup CG ON CG.Id=CI.CustomerGroupId
		LEFT JOIN TenantOffice BL ON BL.Id =C.TenantOfficeId
		LEFT JOIN TenantRegion TR ON TR.Id=ML.RegionId
		INNER JOIN AssetProductCategory APC ON APC.Id =CAPD.AssetProductCategoryId
	WHERE   (@TenantRegionId IS NULL OR ML.RegionId = @TenantRegionId)
          AND (@TenantOfficeId IS NULL OR C.TenantOfficeId = @TenantOfficeId) AND
		  (
			@UserCategory = 'UCT_FRHO'	OR 
	  	    (@UserCategory = 'UCT_CPTV' AND (ML.Id = @UserOfficeId  OR BL.Id = @UserOfficeId))	OR
	        (@UserCategory = 'UCT_FRRO' AND (ML.RegionId = @UserRegionId OR BL.RegionId = @UserRegionId)) 
		  ) AND 
		  (@CustomerId IS NULL OR @CustomerId = CI.CustomerId)
	ORDER BY TR.Id DESC
END