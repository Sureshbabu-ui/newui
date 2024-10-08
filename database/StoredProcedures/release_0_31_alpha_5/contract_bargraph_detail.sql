CREATE OR ALTER   PROCEDURE [dbo].[contract_bargraph_detail]
    @RegionId    INT = NULL,
    @StartDate      DATE ,
    @EndDate		DATE
AS
BEGIN 
	SET NOCOUNT ON;
	IF(@RegionId IS NULL)
	WITH ContractCounts AS (
		SELECT TenantOffice.RegionId, COUNT(C.Id) AS ContractCount
		FROM [Contract] C
		INNER JOIN TenantOffice ON C.TenantOfficeId = TenantOffice.Id
		INNER JOIN MasterEntityData MED ON MED.Id = C.ContractStatusId
		WHERE (C.SecondApprovedOn BETWEEN @StartDate AND @EndDate) AND (MED.Code = 'CTS_APRV')
		GROUP BY TenantOffice.RegionId)
	SELECT
		TenantRegion.Code,
		ISNULL(CC.ContractCount, 0) AS ContractCount
	FROM TenantRegion
	LEFT JOIN ContractCounts CC ON TenantRegion.Id = CC.RegionId;
	ELSE
	WITH ContractCounts AS (
		SELECT TenantOfficeId, COUNT(C.Id) AS ContractCount
		FROM Contract AS C
		INNER JOIN MasterEntityData MED ON MED.Id = C.ContractStatusId
		WHERE (C.SecondApprovedOn BETWEEN @StartDate AND @EndDate) AND (MED.Code = 'CTS_APRV')
		GROUP BY TenantOfficeId)
	SELECT
		O.Code,
		ISNULL(CC.ContractCount, 0) AS ContractCount
	FROM TenantOffice O
	INNER JOIN MasterEntityData MED ON MED.Id = O.OfficeTypeId
	LEFT JOIN ContractCounts CC ON CC.TenantOfficeId = O.Id
	WHERE (MED.Code = 'TOT_AROF')
	AND O.RegionId = @RegionId;
END