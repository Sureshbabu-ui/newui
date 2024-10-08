CREATE OR ALTER PROCEDURE [dbo].[billingdetail_report_download]
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

	SELECT 
    TR.RegionName,
	TOC.OfficeName,
	CG.GroupName +'(' + CG.GroupCode + ')' GroupName,
	CI.NameOnPrint,
	BT.[Name] BookingType, 
	C.ContractNumber,
	FORMAT(CIS.StartDate , @DateFormat) PaymentPeriodFrom,
	FORMAT(CIS.EndDate , @DateFormat) PaymentPeriodTo,
	FORMAT(CIS.ScheduledInvoiceDate, @DateFormat) DueDate,
	I.InvoiceNumber,
	FORMAT(I.InvoiceDate, @DateFormat) InvoiceDate,
	CIS.ScheduledInvoiceAmount,
	I.InvoiceAmount+I.Cgst+I.Sgst+I.Igst -I.DeductionAmount NetInvoiceAmount,
	I.Cgst+I.Sgst+I.Igst Gst
	
    FROM  ContractInvoiceSchedule CIS
	LEFT JOIN ContractInvoice CTI ON CTI.ContractInvoiceScheduleId = CIS.Id
	LEFT JOIN Invoice I ON I.Id=CTI.InvoiceId
	LEFT JOIN [Contract] C ON C.Id=CIS.ContractId
	INNER JOIN MasterEntityData BT ON BT.Id = C.BookingTypeId
	INNER JOIN PaymentFrequency PF ON PF.Id = C.PaymentFrequencyId
    LEFT JOIN Customer CR ON CR.Id =C.CustomerId
	LEFT JOIN CustomerInfo CI on CI.CustomerId = C.CustomerId AND CI.EffectiveTo IS NULL
	LEFT JOIN CustomerGroup CG ON CG.Id=CI.CustomerGroupId
	LEFT JOIN TenantOffice TOC ON TOC.Id =C.TenantOfficeId
	LEFT JOIN TenantRegion TR ON TR.Id=TOC.RegionId
	LEFT JOIN UserInfo UI ON UI.Id =  C.SalesContactPersonId
	WHERE (CAST(CIS.ScheduledInvoiceDate AS DATE) BETWEEN CAST(@DateFrom AS DATE) AND CAST(@DateTo AS DATE))
          AND (@TenantRegionId IS NULL OR TOC.RegionId = @TenantRegionId)
          AND (@TenantOfficeId IS NULL OR C.TenantOfficeId = @TenantOfficeId) AND
		  (
			@UserCategory = 'UCT_FRHO'
			OR (@UserCategory = 'UCT_CPTV' AND TOC.Id = @UserOfficeId)
			OR (@UserCategory = 'UCT_FRRO' AND TOC.RegionId = @UserRegionId)
		  )
		  AND (@CustomerGroupId IS NULL OR @CustomerGroupId = CI.CustomerGroupId)
		  AND (@CustomerId IS NULL OR @CustomerId = CI.CustomerId)
	ORDER BY TR.Id DESC
END