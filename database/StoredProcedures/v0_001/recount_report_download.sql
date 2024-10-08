CREATE OR ALTER PROCEDURE [dbo].[recount_report_download]
    @DateFrom VARCHAR(64) = NULL,
    @DateTo VARCHAR(64) = NULL,
    @TimeZone VARCHAR(64),
    @TenantRegionId INT = NULL,
    @TenantOfficeId INT = NULL,
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

	IF @DateFrom IS NULL OR @DateTo = ''
    SET @DateFrom = CAST(DATEADD(DAY, -30, GETUTCDATE()) AS DATE); 
    IF @DateTo IS NULL OR @DateTo = ''
    SET @DateTo = CAST(GETUTCDATE() AS DATE);
	SET @DateTo = DATEADD(SECOND, -1, DATEADD(DAY, 1, @DateTo));

	SELECT
		C.ContractNumber,
		ATE.[Name] AS AgreementType,
		T.Code AS LocationCode,
		CM.EngineerCount,
		FORMAT(CAST(C.StartDate AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE @TimeZone,'dd-MM-yyyy HH:mm:ss') AS PeriodFrom,
		FORMAT(CAST(C.EndDate AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE @TimeZone,'dd-MM-yyyy HH:mm:ss') AS PeriodTo,
		C.FmsValue AS Amount,
		FORMAT(CAST(C.CreatedOn AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE @TimeZone,'dd-MM-yyyy HH:mm:ss') AS ContractDate,
		(SELECT COUNT(CMA.Id) FROM ContractManpowerAllocation CMA WHERE CMA.ContractId = C.Id )AS RECount,
		CI.[Name] AS CustomerName,
		(CASE WHEN C.IsMultiSite = 1 THEN 'Multi' ELSE 'One' END) AS IsMultiSite,
		CM.CustomerAgreedAmount
	FROM ContractManpower CM
		LEFT JOIN [Contract] C ON C.Id = CM.ContractId
		LEFT JOIN CustomerInfo CI ON CI.Id = C.CustomerInfoId
		LEFT JOIN MasterEntityData ATE ON ATE.Id = C.AgreementTypeId
		LEFT JOIN TenantOfficeInfo TOI ON TOI.Id = CM.TenantOfficeInfoId
		LEFT JOIN TenantOffice T ON T.Id = TOI.TenantOfficeId
	WHERE  
		(CAST(C.StartDate AS DATE) BETWEEN CAST(@DateFrom AS DATE) AND CAST(@DateTo AS DATE)) AND
        (@TenantRegionId IS NULL OR T.RegionId = @TenantRegionId) AND 
		(@TenantOfficeId IS NULL OR T.Id = @TenantOfficeId) AND
		(
				@UserCategory = 'UCT_FRHO'
				OR (@UserCategory = 'UCT_CPTV' AND T.Id = @UserOfficeId)
				OR (@UserCategory = 'UCT_FRRO' AND T.RegionId = @UserRegionId)
		)
	ORDER BY CM.CreatedOn DESC 		
END