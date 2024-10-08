CREATE OR ALTER PROCEDURE [dbo].[consumption_summary_report_download]
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

    IF @DateFrom IS NULL OR @DateFrom = ''
    SET @DateFrom = CAST(DATEADD(DAY, -30, GETUTCDATE()) AS DATE); 
    IF @DateTo IS NULL OR @DateTo = ''
    SET @DateTo = CAST(GETUTCDATE() AS DATE);
    SET @DateTo = DATEADD(SECOND, -1, DATEADD(DAY, 1, @DateTo));

    SELECT 
        T.Code AS LocationCode,
        COUNT(PIN.Id) AS Quantity,
        SUM(PS.Rate) AS TotalRate
    FROM PartInstallation PIN
        INNER JOIN PartStock PS ON PS.Id = PIN.PartStockId
        INNER JOIN TenantOffice T ON T.Id = PS.TenantOfficeId
    WHERE  
        (CAST(PIN.InstalledOn AS DATE) BETWEEN CAST(@DateFrom AS DATE) AND CAST(@DateTo AS DATE)) AND
        (@TenantRegionId IS NULL OR T.RegionId = @TenantRegionId) AND 
        (@TenantOfficeId IS NULL OR T.Id = @TenantOfficeId) AND
        (
            @UserCategory = 'UCT_FRHO'
            OR (@UserCategory = 'UCT_CPTV' AND T.Id = @UserOfficeId)
            OR (@UserCategory = 'UCT_FRRO' AND T.RegionId = @UserRegionId)
        )
    GROUP BY T.Code
    ORDER BY T.Code ASC;  -- Optional: Order by LocationCode if needed
END