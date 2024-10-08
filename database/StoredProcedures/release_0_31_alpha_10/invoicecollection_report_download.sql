﻿CREATE OR ALTER PROCEDURE [dbo].[invoicecollection_report_download]
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
	TOC.OfficeName,
	TR.RegionName,
	CG.GroupName +'(' + CG.GroupCode + ')' AS GroupName,
	I.InvoiceNumber,
	FORMAT(I.InvoiceDate, 'dd-MM-yyyy') AS InvoiceDate,
	IR.NetInvoiceAmount,
	C.PoNumber,
	C.ContractNumber,
	CI.NameOnPrint,
	FORMAT(R.ReceiptDate, 'dd-MM-yyyy') AS ReceiptDate,
    PaymentMethod.[Name]PaymentMethod,
	IR.CollectedAmount,
	IR.GstTdsPaidAmount,
	IR.TdsPaidAmount,
	IR.CollectedAmount+IR.GstTdsPaidAmount+IR.TdsPaidAmount AS TotalCollection,
	BC.TransactionReferenceNumber,
	FORMAT(BC.TransactionDate, 'dd-MM-yyyy') AS TransactionDate,
	FORMAT(BC.ChequeRealizedOn, 'dd-MM-yyyy') ChequeRealizedOn,
	BC.CustomerBankName,
	ClaimedBy.FullName ClaimedBy

    FROM InvoiceReconciliation IR
    LEFT JOIN Invoice I on I.Id = IR.InvoiceId
	LEFT JOIN InvoiceReceipt IRT ON IRT.InvoiceId =I.Id
	LEFT JOIN Receipt R ON R.Id =IRT.ReceiptId
	LEFT JOIN ContractInvoice ON ContractInvoice.InvoiceId =I.Id
	LEFT JOIN [Contract] C ON C.Id=ContractInvoice.ContractId
	INNER JOIN BankCollection BC ON BC.Id = R.BankCollectionId
    LEFT JOIN Customer CR ON CR.Id =C.CustomerId
	LEFT JOIN CustomerInfo CI on CI.CustomerId = C.CustomerId AND CI.EffectiveTo IS NULL
	LEFT JOIN CustomerGroup CG ON CG.Id=CI.CustomerGroupId
	LEFT JOIN TenantOffice TOC ON TOC.Id =C.TenantOfficeId
	LEFT JOIN TenantRegion TR ON TR.Id=TOC.RegionId
	LEFT JOIN MasterEntityData PaymentMethod ON PaymentMethod.Id = BC.PaymentMethodId
	LEFT JOIN UserInfo ClaimedBy ON ClaimedBy.Id =  C.SalesContactPersonId
	WHERE (CAST(BC.TransactionDate AS DATE) BETWEEN CAST(@DateFrom AS DATE) AND CAST(@DateTo AS DATE))
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