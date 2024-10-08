CREATE OR ALTER PROCEDURE [dbo].[revenuerecognition_list_by_contract] 
    @ContractId INT,
    @StartDate DATE,
    @EndDate DATE 
AS 
BEGIN 
    SET NOCOUNT ON;

    CREATE TABLE #ContractCTE (
        IsBaseLocation INT,
        OfficeName NVARCHAR(255),
        AssetId INT,
        AmcValue DECIMAL(16, 2),
        ManPowerId INT,
        CustomerAgreedAmount DECIMAL(16, 2)
    );

    INSERT INTO #ContractCTE
    SELECT
        CASE WHEN TenantOffice.Id = BaseLocation.Id THEN 1 ELSE 0 END AS IsBaseLocation,
        CASE WHEN TenantOffice.Id = BaseLocation.Id THEN BaseLocation.OfficeName +'(Base Location)' ELSE TenantOffice.OfficeName END AS OfficeName,
        CAD.Id AS AssetId,
        CAD.AmcValue * (DATEDIFF(
                            DAY,
                            CASE 
                                WHEN @StartDate IS NULL OR @StartDate < CAD.AmcStartDate THEN CAD.AmcStartDate
                                WHEN @StartDate >= CAD.AmcEndDate THEN DATEADD(DAY, 1, CAD.AmcEndDate)
                                ELSE @StartDate
                            END,
                            CASE 
                                WHEN @EndDate IS NULL OR @EndDate > CAD.AmcEndDate THEN CAD.AmcEndDate
                                WHEN @EndDate < CAD.AmcStartDate THEN DATEADD(DAY, -1, CAD.AmcStartDate)
                                ELSE @EndDate
                            END
                        ) + 1) / (NULLIF(ISNULL(DATEDIFF(DAY, CAD.AmcStartDate, CAD.AmcEndDate),0) + 1, 0))  AS AmcValue,
        CMPA.Id AS ManPowerId,
        CMPA.CustomerAgreedAmount * (DATEDIFF(
                                            DAY,
                                            CASE 
                                                WHEN @StartDate IS NULL OR @StartDate < CMPA.StartDate THEN CMPA.StartDate
                                                WHEN @StartDate >= CMPA.EndDate THEN DATEADD(DAY, 1, CMPA.EndDate)
                                                ELSE @StartDate
                                            END,
                                            CASE 
                                                WHEN @EndDate IS NULL OR @EndDate > CMPA.EndDate THEN CMPA.EndDate
                                                WHEN @EndDate < CMPA.StartDate THEN DATEADD(DAY, -1, CMPA.StartDate)
                                                ELSE @EndDate
                                            END
                                        ) + 1) / (NULLIF(ISNULL(DATEDIFF(DAY, CMPA.StartDate, CMPA.EndDate),0) + 1, 0)) AS CustomerAgreedAmount
    FROM
        Contract AS C
        LEFT JOIN ContractCustomerSite AS CCS ON CCS.ContractId = C.Id
        LEFT JOIN CustomerSite AS CS ON CS.Id = CCS.CustomerSiteId
        INNER JOIN TenantOffice ON TenantOffice.Id = CS.TenantOfficeId  
		LEFT JOIN Asset A ON A.CustomerSiteId = CS.Id
        LEFT JOIN ContractAssetDetail AS CAD ON CAD.AssetId = A.Id
        LEFT JOIN ContractManpowerAllocation AS CMPA ON CMPA.CustomerSiteId = CS.Id
        LEFT JOIN TenantOffice AS BaseLocation ON BaseLocation.Id = C.TenantOfficeId 
    WHERE
        C.Id = @ContractId AND CAD.IsActive = 1

    DECLARE @BaseRevenueFmsPercentage DECIMAL(16,2)=(SELECT TOP 1 AppValue FROM AppSetting WHERE AppKey= 'BaseLocRevenueFmsPercentage')
    DECLARE @BaseRevenueAmcPercentage DECIMAL(16,2)=(SELECT TOP 1 AppValue FROM AppSetting WHERE AppKey= 'BaseLocRevenueAmcPercentage')
    DECLARE @BaseLocationAmc DECIMAL(16, 2);
    SELECT @BaseLocationAmc = SUM(AmcValue)*@BaseRevenueAmcPercentage/100 FROM #ContractCTE;
    DECLARE @BaseLocationFms DECIMAL(16, 2);
    SELECT @BaseLocationFms = SUM(CustomerAgreedAmount)*@BaseRevenueFmsPercentage/100 FROM #ContractCTE;
 
    SELECT
        OfficeName,
        SUM(ISNULL(AmcValue, 0)) * (100-@BaseRevenueAmcPercentage)/100 + CASE WHEN IsBaseLocation = 1 THEN @BaseLocationAmc ELSE 0 END AS AmcValue,
        SUM(ISNULL(CustomerAgreedAmount, 0)) * (100-@BaseRevenueFmsPercentage)/100 + CASE WHEN IsBaseLocation = 1 THEN @BaseLocationFms ELSE 0 END AS ManPowerValue
    FROM
        #ContractCTE
    GROUP BY
        OfficeName, IsBaseLocation
    ORDER BY
        OfficeName ASC;

    DROP TABLE #ContractCTE;
END;
