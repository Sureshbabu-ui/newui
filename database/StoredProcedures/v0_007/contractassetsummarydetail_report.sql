CREATE OR ALTER   PROCEDURE [dbo].[contractassetsummarydetail_report]
	@ContractId INT = NULL,
	@StartDate DATETIME,
	@EndDate DATETIME,
	@ContractStatusId INT = NULL,
	@DateFilterOnContractStartDate BIT, -- If 0 then filter will be on End date
	@TenantOfficeId INT = NULL,
	@TenantRegionId INT = NULL,
	@CustomerId INT = NULL,
	@ContractValueRangeStart DECIMAL(16,2) = NULL,
	@ContractValueRangeEnd DECIMAL(16,2) = NULL,
	@AmcValueRangeStart DECIMAL(16,2) = NULL,
	@AmcValueRangeEnd DECIMAL(16,2) = NULL,
	@FmsValueRangeStart DECIMAL(16,2) = NULL,
	@FmsValueRangeEnd DECIMAL(16,2) = NULL,
	@SalesExecutiveEmpId INT = NULL,
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


	WITH ContractAssetSummary_grouped (ContractId, TotalAssetValue)
	AS
	(
		SELECT ContractId, SUM(AmcValue) AS TotalAMCValue
		FROM dbo.ContractAssetSummary
		GROUP BY ContractId
	)
	SELECT 
	C.Id,
	C.ContractNumber,
	T.Code,
	T.OfficeName,
	CI.Name,
	C.StartDate,
	C.EndDate,
	C.ContractValue,
	CASG.TotalAssetValue
	FROM dbo.Contract C
	LEFT JOIN TenantOffice T ON T.Id = C.TenantOfficeId
	LEFT JOIN Customer CUS ON CUS.Id = C.CustomerId
	LEFT JOIN CustomerInfo CI ON CI.CustomerId = CUS.Id AND CI.IsActive = 1
	LEFT JOIN ContractAssetSummary_grouped CASG ON CASG.ContractId = C.Id
	LEFT JOIN ContractAssetDetail CAD ON CAD.ContractId = C.Id
	LEFT JOIN Asset A ON A.Id = CAD.AssetId
	LEFT JOIN TenantOffice CL ON CL.Id = A.TenantOfficeId
	WHERE (@ContractId IS NULL OR C.Id = @ContractId) AND
		  (@TenantOfficeId IS NULL OR C.TenantOfficeId = @TenantOfficeId) AND
		  (@TenantRegionId IS NULL OR T.RegionId = @TenantRegionId) AND
		  (@CustomerId IS NULL OR C.CustomerId = @CustomerId) AND
		  (@ContractValueRangeStart IS NULL AND @ContractValueRangeEnd IS NULL OR C.ContractValue BETWEEN @ContractValueRangeStart AND @ContractValueRangeEnd) AND
		  (@AmcValueRangeStart IS NULL AND @AmcValueRangeEnd IS NULL OR C.AmcValue BETWEEN @AmcValueRangeStart AND @AmcValueRangeEnd) AND 
		  (@FmsValueRangeStart IS NULL AND @FmsValueRangeEnd IS NULL OR C.FmsValue BETWEEN @FmsValueRangeStart AND @FmsValueRangeEnd) AND
		  (@SalesExecutiveEmpId IS NULL OR C.SalesContactPersonId = @SalesExecutiveEmpId) AND
		  (@ContractStatusId IS NULL OR C.ContractStatusId = @ContractStatusId) AND
		  (
				@UserCategory = 'UCT_FRHO'	OR 
				(@UserCategory = 'UCT_CPTV' AND (T.Id = @UserOfficeId OR A.TenantOfficeId = @UserOfficeId))	OR
				(@UserCategory = 'UCT_FRRO' AND (T.RegionId = @UserRegionId OR CL.RegionId = @UserRegionId)) 
		  ) AND
		  (CASE 
				WHEN @DateFilterOnContractStartDate = 1 THEN 
					CASE WHEN (C.StartDate BETWEEN @StartDate AND @EndDate) THEN 1 ELSE 0 END
				ELSE 
					CASE WHEN (C.EndDate BETWEEN @StartDate AND @EndDate) THEN 1 ELSE 0 END
			END = 1)
END