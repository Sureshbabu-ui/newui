CREATE OR ALTER PROCEDURE [dbo].[revenuedue_report_download]
    @DateFrom VARCHAR(64) = NULL,
    @DateTo VARCHAR(64) = NULL,
    @TenantRegionId INT = NULL,
    @TenantOfficeId INT = NULL,
	@CustomerGroupId INT = NULL,
	@CustomerId INT = NULL,
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

	---Didnot consider invoice cancellation
	 ;WITH OutstandingAmounts AS (
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
	TOC.OfficeName,
	C.ContractNumber,
	FORMAT(C.BookingDate, @DateFormat) BookingDate,
	FORMAT(C.StartDate, @DateFormat) StartDate,
	FORMAT(C.EndDate, @DateFormat) EndDate,
	CG.GroupName +'(' + CG.GroupCode + ')' GroupName,
	CI.NameOnPrint,
	FORMAT(CIS.ScheduledInvoiceDate, @DateFormat) DueDate,
	FORMAT(CIS.StartDate , @DateFormat) PaymentPeriodFrom,
	FORMAT(CIS.EndDate , @DateFormat) PaymentPeriodTo,
	CIS.ScheduledInvoiceAmount,
	BT.[Name] BookingType, 
	PF.[Name] PaymentType,
	CASE  WHEN OA.TotalOutstandingAmount >0 THEN 'YES' ELSE 'NO' END OutStanding,
	OA.TotalOutStandingAmount,
	'' InvoiceSubmitType,
	'' LastStatusDate,
	'' StatusUpdate
    FROM  ContractInvoiceSchedule CIS
	LEFT JOIN ContractInvoice CTI ON CTI.ContractInvoiceScheduleId = CIS.Id
	LEFT JOIN [Contract] C ON C.Id=CIS.ContractId
	INNER JOIN MasterEntityData BT ON BT.Id = C.BookingTypeId
	INNER JOIN PaymentFrequency PF ON PF.Id = C.PaymentFrequencyId
    LEFT JOIN Customer CR ON CR.Id =C.CustomerId
	LEFT JOIN CustomerInfo CI on CI.CustomerId = C.CustomerId AND CI.EffectiveTo IS NULL
	LEFT JOIN CustomerGroup CG ON CG.Id=CI.CustomerGroupId
	LEFT JOIN TenantOffice TOC ON TOC.Id =C.TenantOfficeId
	LEFT JOIN TenantRegion TR ON TR.Id=TOC.RegionId
	LEFT JOIN UserInfo UI ON UI.Id =  C.SalesContactPersonId
	LEFT JOIN OutstandingAmounts OA ON OA.ContractId = C.Id
	WHERE (CAST(CIS.ScheduledInvoiceDate AS DATE) BETWEEN CAST(@DateFrom AS DATE) AND CAST(@DateTo AS DATE))
	      AND CTI.Id IS NULL
          AND (@TenantRegionId IS NULL OR TOC.RegionId = @TenantRegionId)
          AND (@TenantOfficeId IS NULL OR C.TenantOfficeId = @TenantOfficeId) 
		  AND (@CustomerId IS NULL OR @CustomerId = CI.CustomerId) 
		  AND
		  (
			@UserCategory = 'UCT_FRHO'
			OR (@UserCategory = 'UCT_CPTV' AND TOC.Id = @UserOfficeId)
			OR (@UserCategory = 'UCT_FRRO' AND TOC.RegionId = @UserRegionId)
		  )
		  AND (@CustomerGroupId IS NULL OR @CustomerGroupId = CI.CustomerGroupId)
	ORDER BY TR.Id DESC
END