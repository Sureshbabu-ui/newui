CREATE OR ALTER PROCEDURE [dbo].[pmassetdetail_report_download]
    @TimeZone VARCHAR(64),
    @StatusType VARCHAR(64)=NULL,
    @DateFrom VARCHAR(64) = NULL,
    @DateTo VARCHAR(64) = NULL,
    @TenantRegionId INT = NULL,
    @TenantOfficeId INT = NULL,
	@CustomerId INT = NULL,
	@ContractId INT = NULL,
	@CustomerSiteId INT = NULL,
	@AssetProductCategoryId INT = NULL,
	@MakeId INT = NULL,
	@ProductModelId INT =NULL,
	@UserId INT
AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @UserCategory VARCHAR(64);
	DECLARE @UserOfficeId INT;
	DECLARE @UserRegionId INT;

	DECLARE @DateFormat VARCHAR(16) = 'dd-MM-yyyy '
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

	SELECT 
    TR.RegionName,
	BL.OfficeName BaseLocation,
	ML.OfficeName MappedLocation,
	CG.GroupName +'(' + CG.GroupCode + ')' GroupName,
	CI.NameOnPrint CustomerName,
	C.ContractNumber,
	CS.SiteName,
	A.ProductSerialNumber,
	APC.CategoryName,
	P.ModelName,
	M.[Name] MakeName,
FORMAT(CAST(CPMD.PmScheduledDate AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE @TimeZone,@DateFormat) PmScheduledDate ,
FORMAT(CAST(CPMD.PmDate AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE @TimeZone,@DateFormat) PmDate ,
	UI.FullName EngineerName,
	CASE WHEN(CAD.IsOutSourcingNeeded =1 ) THEN 'YES' ELSE 'NO' END IsOutSourcingNeeded,
	VI.[Name] + '(' +V.VendorCode + ')' Vendor
	
    FROM  ContractAssetPMDetail CPMD 
	LEFT JOIN ContractAssetDetail CAD ON CAD.Id = CPMD.ContractAssetDetailId
	INNER JOIN Asset A ON A.Id = CAD.AssetId
	LEFT JOIN [Contract] C ON C.Id = CAD.ContractId
	INNER JOIN CustomerSite CS ON CS.Id = CPMD.CustomerSiteId
	LEFT JOIN TenantOffice ML ON ML.Id =CS.TenantOfficeId
    LEFT JOIN Customer CR ON CR.Id =C.CustomerId
	LEFT JOIN CustomerInfo CI on CI.CustomerId = C.CustomerId AND CI.EffectiveTo IS NULL
	LEFT JOIN CustomerGroup CG ON CG.Id=CI.CustomerGroupId
	LEFT JOIN TenantOffice BL ON BL.Id =C.TenantOfficeId
	LEFT JOIN TenantRegion TR ON TR.Id=ML.RegionId
	LEFT JOIN UserInfo UI ON UI.Id =  CPMD.PmEngineerId
	LEFT JOIN Vendor V ON V.Id = CPMD.PmVendorId
	LEFT JOIN VendorInfo VI ON VI.VendorId = V.Id AND VI.EffectiveTo IS NULL
	INNER JOIN AssetProductCategory APC ON APC.Id =A.AssetProductCategoryId
	INNER JOIN Make M ON M.Id =A.ProductMakeId
	INNER JOIN Product P ON P.Id = A.ProductModelId
	WHERE (CAST(CPMD.PmScheduledDate AS DATE) BETWEEN CAST(@DateFrom AS DATE) AND CAST(@DateTo AS DATE))
          AND (@TenantRegionId IS NULL OR ML.RegionId = @TenantRegionId)
          AND (@TenantOfficeId IS NULL OR C.TenantOfficeId = @TenantOfficeId) AND
		  (
			@UserCategory = 'UCT_FRHO'	OR 
	  	    (@UserCategory = 'UCT_CPTV' AND (ML.Id = @UserOfficeId  OR BL.Id = @UserOfficeId))	OR
	        (@UserCategory = 'UCT_FRRO' AND (ML.RegionId = @UserRegionId OR BL.RegionId = @UserRegionId)) 
		   ) AND
		  (@CustomerId IS NULL OR @CustomerId = CR.Id) AND 	
		  (@ContractId IS NULL OR @ContractId = C.Id) AND
		  (@CustomerSiteId IS NULL OR @CustomerSiteId = CS.Id) AND
		  (@AssetProductCategoryId IS NULL OR @AssetProductCategoryId =A.AssetProductCategoryId) AND
		  (@ProductModelId IS NULL OR @ProductModelId =A.ProductModelId) AND
		  (@MakeId IS NULL OR @MakeId =A.ProductMakeId) AND
		  (
            @StatusType IS NULL
            OR (@StatusType = '1' AND CPMD.PmDate IS NOT NULL)
            OR (@StatusType = '0' AND CPMD.PmDate IS NULL)
          )
	ORDER BY TR.Id DESC
END