CREATE OR ALTER PROCEDURE [dbo].[consumption_report_download]
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
    WHERE UserInfo.Id = @UserId;

    IF @DateFrom IS NULL OR @DateFrom = ''
    SET @DateFrom = CAST(DATEADD(DAY, -30, GETUTCDATE()) AS DATE); 
    IF @DateTo IS NULL OR @DateTo = ''
	SET @DateTo = CAST(GETUTCDATE() AS DATE);
    SET @DateTo = DATEADD(SECOND, -1, DATEADD(DAY, 1, @DateTo));

    WITH ConsumptionData_CTE AS 
    (
        SELECT 
            T.Code AS LocationCode,
            T.Id AS TenantOfficeId,
            T.RegionId AS RegionId,
            COUNT(PIN.Id) AS Quantity,
            SUM(PS.Rate) AS TotalRate,
            Part.PartCode,
            PS.StockTypeId,
            PIN.ServiceEngineerVisitId,
            PIN.ServiceRequestId,
            PIN.InstalledOn
        FROM PartInstallation PIN
        INNER JOIN PartStock PS ON PS.Id = PIN.PartStockId
        INNER JOIN TenantOffice T ON T.Id = PS.TenantOfficeId
        INNER JOIN Part ON Part.Id = PS.PartId
        WHERE  
            (CAST(PIN.InstalledOn AS DATE) BETWEEN CAST(@DateFrom AS DATE) AND CAST(@DateTo AS DATE))
            AND (@TenantRegionId IS NULL OR T.RegionId = @TenantRegionId)
            AND (@TenantOfficeId IS NULL OR T.Id = @TenantOfficeId)
            AND (
                @UserCategory = 'UCT_FRHO'
                OR (@UserCategory = 'UCT_CPTV' AND T.Id = @UserOfficeId)
                OR (@UserCategory = 'UCT_FRRO' AND T.RegionId = @UserRegionId)
            )
        GROUP BY 
            T.Code, Part.PartCode, PIN.ServiceEngineerVisitId, 
            PIN.ServiceRequestId, PIN.InstalledOn, T.Id, 
            T.RegionId, PS.StockTypeId
    )

    SELECT 
        SR.WorkOrderNumber,
        Part.PartCode,
		CTE.LocationCode,
		CTE.Quantity,
		CTE.TotalRate,
        Part.[Description],
        C.ContractNumber,
        C.StartDate,
        C.EndDate,
        CI.[Name] AS Customer,
        UI.EmployeeCode,
        UI.FullName AS Engineer,
        APC.CategoryName,
        Asset.ProductSerialNumber,
        Product.ModelName,
        StockType.[Name] AS PartType,
        PartCategory.[Name] AS PartCategory,
        EngType.[Name] AS EngType
    FROM Part
		INNER JOIN ConsumptionData_CTE CTE ON CTE.PartCode = Part.PartCode
		INNER JOIN MasterEntityData StockType ON StockType.Id = CTE.StockTypeId
		INNER JOIN PartCategory ON PartCategory.Id = Part.PartCategoryId
		INNER JOIN ServiceRequest SR ON SR.Id = CTE.ServiceRequestId
		INNER JOIN [Contract] C ON C.Id = SR.ContractId
		INNER JOIN CustomerInfo CI ON CI.Id = C.CustomerInfoId
		INNER JOIN ServiceEngineerVisit SRV ON SRV.Id = CTE.ServiceEngineerVisitId
		INNER JOIN UserInfo UI ON UI.Id = SRV.CreatedBy
		INNER JOIN ContractAssetDetail CAD ON CAD.Id = SR.ContractAssetId
		INNER JOIN Asset ON Asset.Id = CAD.AssetId
		INNER JOIN AssetProductCategory APC ON APC.Id = Asset.AssetProductCategoryId
		INNER JOIN Product ON Product.Id = Asset.ProductModelId
		LEFT JOIN ServiceEngineerInfo SEI ON SEI.UserInfoId = SRV.CreatedBy
		LEFT JOIN MasterEntityData EngType ON EngType.Id = SEI.EngineerType
    WHERE
        (CAST(CTE.InstalledOn AS DATE) BETWEEN CAST(@DateFrom AS DATE) AND CAST(@DateTo AS DATE))
        AND (@TenantRegionId IS NULL OR CTE.RegionId = @TenantRegionId)
        AND (@TenantOfficeId IS NULL OR CTE.TenantOfficeId = @TenantOfficeId)
        AND (
            @UserCategory = 'UCT_FRHO'
            OR (@UserCategory = 'UCT_CPTV' AND CTE.TenantOfficeId = @UserOfficeId)
            OR (@UserCategory = 'UCT_FRRO' AND CTE.RegionId = @UserRegionId)
        )
    ORDER BY CTE.LocationCode ASC;
END