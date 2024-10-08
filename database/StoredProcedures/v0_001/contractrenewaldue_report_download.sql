CREATE OR ALTER  PROCEDURE [dbo].[contractrenewaldue_report_download]
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
	DECLARE @DateFormat VARCHAR(16) = 'dd-MM-yyyy';
	DECLARE @DateTimeFormat VARCHAR(16) = 'dd-MM-yyyy HH:mm:ss';

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

		WITH OutstandingAmounts AS (
        SELECT
            CIS.ContractId,
            SUM(IR.OutstandingAmount)  TotalOutStandingAmount
        FROM ContractInvoiceSchedule CIS
        LEFT JOIN ContractInvoice CTI ON CTI.ContractInvoiceScheduleId = CIS.Id
		LEFT JOIN Invoice I on I.Id = CTI.InvoiceId
		LEFT JOIN  InvoiceReconciliation IR ON IR.InvoiceId =I.Id
        GROUP BY CIS.ContractId
		)

    SELECT
		TR.RegionName,
		T.Code AS [Location],
        C.ContractNumber,
        Format(C.BookingDate,@DateFormat) BookingDate,
        Format(C.StartDate,@DateFormat) StartDate,
        Format(C.EndDate,@DateFormat) EndDate,
		CG.GroupName,
        CI.[Name] AS CustomerName,
        AGT.Name AS AgreementType,
        C.ContractValue,
		CONCAT (PM.Name,PF.Name) AS PaymentType,
        Format(C.EndDate,@DateFormat) RenewalDate,
		CASE  WHEN OA.TotalOutstandingAmount >0 THEN 'YES' ELSE 'NO' END OutStanding,
		OA.TotalOutStandingAmount,
		FORMAT(CAST(C.UpdatedOn AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE @TimeZone,@DateTimeFormat) AS LastUpdated,
		(SELECT COUNT(Id) FROM ContractManPower WHERE ContractId = C.Id) AS ManPowerCount,
		(SELECT COUNT(Id) FROM ImprestStock WHERE ContractId = C.Id) AS ImprestStockCount,
		DATEDIFF(DAY, CAST(C.EndDate AS DATE), CAST(GETDATE() AS DATE)) AS PendingDays
		FROM [Contract] C
		INNER JOIN TenantOffice T ON T.Id = C.TenantOfficeId
		INNER JOIN TenantRegion TR ON TR.Id = T.RegionId
		INNER JOIN CustomerInfo CI ON CI.Id = C.CustomerInfoId
		LEFT JOIN CustomerGroup CG ON CG.Id = CI.CustomerGroupId
		INNER JOIN PaymentFrequency PF ON PF.ID = C.PaymentFrequencyId
		INNER JOIN MasterEntityData  PM ON PM.Id = C.PaymentModeId
		INNER JOIN MasterEntityData  AGT ON AGT.Id = C.AgreementTypeId
		INNER JOIN OutstandingAmounts OA ON OA.ContractId = C.Id
		WHERE  (CAST(C.CreatedOn AS DATE) BETWEEN CAST(@DateFrom AS DATE) AND CAST(@DateTo AS DATE))
          AND (@TenantRegionId IS NULL OR TR.Id = @TenantRegionId)
          AND (@TenantOfficeId IS NULL OR T.Id = @TenantOfficeId) AND
		  (
			@UserCategory = 'UCT_FRHO'
			OR (@UserCategory = 'UCT_CPTV' AND T.Id = @UserOfficeId)
			OR (@UserCategory = 'UCT_FRRO' AND TR.Id = @UserRegionId)
		) AND C.IsDeleted = 0 AND C.EndDate < GETDATE()
END;