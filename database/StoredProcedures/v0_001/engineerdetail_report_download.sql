CREATE OR ALTER PROCEDURE [dbo].[engineerdetail_report_download]
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
		U.EmployeeCode,
		U.FullName,
        DE.[Name] AS Designation,
		T.OfficeName AS LocationName,
		T.Code AS LocationCode,
		ET.[Name] AS EngineerType,
		C.ContractNumber
	FROM UserInfo U
		LEFT JOIN UserRole ON UserRole.UserId = U.Id
		LEFT JOIN [Role] R ON R.Id = UserRole.RoleId
		LEFT JOIN TenantOffice T ON T.Id = U.TenantOfficeId
		LEFT JOIN TenantRegion ON TenantRegion.Id = T.RegionId
		LEFT JOIN Designation DE ON U.DesignationId = DE.Id
		LEFT JOIN ServiceEngineerInfo SEI ON SEI.UserInfoId = U.Id
		LEFT JOIN MasterEntityData ET ON ET.Id = SEI.EngineerCategory
		LEFT JOIN ContractManpowerAllocation CMA ON CMA.EmployeeId = U.Id
		LEFT JOIN [Contract] C ON C.Id = CMA.ContractId
	WHERE  
		U.IsDeleted = 0 
		AND R.Code = 'SE'
		--AND (CAST(C.CreatedOn AS DATE) BETWEEN CAST(@DateFrom AS DATE) AND CAST(@DateTo AS DATE))
        AND (@TenantRegionId IS NULL OR T.RegionId = @TenantRegionId)
        AND (@TenantOfficeId IS NULL OR T.Id = @TenantOfficeId) 
		AND (
				@UserCategory = 'UCT_FRHO'
				OR (@UserCategory = 'UCT_CPTV' AND T.Id = @UserOfficeId)
				OR (@UserCategory = 'UCT_FRRO' AND T.RegionId = @UserRegionId)
		    )
	ORDER BY U.CreatedOn DESC 		
END