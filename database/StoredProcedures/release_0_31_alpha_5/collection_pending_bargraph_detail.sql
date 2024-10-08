CREATE OR ALTER   PROCEDURE [dbo].[collection_pending_bargraph_detail]
    @RegionId    INT = NULL,
    @StartDate      DATE ,
    @EndDate		DATE
AS
BEGIN
	SET NOCOUNT ON;
	IF(@RegionId IS NULL)
	WITH RegionInvoice AS (
		SELECT TR.Id,
				ISNULL(SUM(I.InvoiceAmount + I.Sgst + I.Cgst + I.Igst), 0) AS Amount
		FROM Invoice I
		INNER JOIN ContractInvoice CI ON I.Id = CI.InvoiceId
		INNER JOIN Contract C ON CI.ContractId = C.Id
		INNER JOIN TenantOffice T ON C.TenantOfficeId = T.Id 
		INNER JOIN MasterEntityData MED ON MED.Id = T.OfficeTypeId
		INNER JOIN TenantRegion TR ON T.RegionId = TR.Id
		WHERE (MED.Code = 'TOT_AROF') AND I.InvoiceDate BETWEEN @StartDate AND @EndDate
		GROUP BY TR.Id
	),
	RegionReceipt AS (
		SELECT TR.Id,
				ISNULL(SUM(R.Amount), 0) AS Amount
		FROM InvoiceReceipt R
		INNER JOIN Invoice I ON I.Id = R.InvoiceId
		INNER JOIN ContractInvoice CI ON R.InvoiceId = CI.InvoiceId
		INNER JOIN Contract C ON CI.ContractId = C.Id
		INNER JOIN TenantOffice T ON C.TenantOfficeId = T.Id 
		INNER JOIN MasterEntityData MED ON MED.Id = T.OfficeTypeId
		INNER JOIN TenantRegion TR ON T.RegionId = TR.Id
		WHERE (MED.Code = 'TOT_AROF') AND I.InvoiceDate BETWEEN @StartDate AND @EndDate
		GROUP BY TR.Id
	)
	SELECT TR.Code, ISNULL(RI.Amount, 0) - ISNULL(RR.Amount, 0) AS Amount
	FROM TenantRegion TR
	LEFT JOIN RegionInvoice RI ON TR.Id = RI.Id
	LEFT JOIN RegionReceipt  RR ON TR.Id = RR.Id;
	ELSE
	WITH TotalInvoiceAmounts AS (
		SELECT
			TenantOfficeId,
			ISNULL(SUM(I.InvoiceAmount + I.Sgst + I.Cgst + I.Igst), 0) AS TotalInvoiceAmount
		FROM TenantOffice
		INNER JOIN Contract AS C ON C.TenantOfficeId = TenantOffice.Id
		INNER JOIN ContractInvoice AS CI ON CI.ContractId = C.Id
		INNER JOIN Invoice AS I ON I.Id = CI.InvoiceId
		WHERE (I.InvoiceDate BETWEEN @StartDate AND @EndDate)
		GROUP BY TenantOfficeId
	),
	TotalReceiptAmounts AS (
		SELECT
			TenantOfficeId,
			ISNULL(SUM(R.Amount), 0) AS TotalReceiptAmount
		FROM TenantOffice
		INNER JOIN Contract AS C ON C.TenantOfficeId = TenantOffice.Id
		INNER JOIN ContractInvoice AS CI ON CI.ContractId = C.Id
		INNER JOIN Invoice AS I ON I.Id = CI.InvoiceId
		LEFT JOIN InvoiceReceipt AS R ON I.Id = R.InvoiceId
		WHERE (I.InvoiceDate BETWEEN @StartDate AND @EndDate)
		GROUP BY TenantOfficeId
	)
	SELECT
		TenantOffice.Code,
		ISNULL(TIA.TotalInvoiceAmount - TRA.TotalReceiptAmount, 0) AS Amount
	FROM TenantOffice
	INNER JOIN MasterEntityData MED ON MED.Id = TenantOffice.OfficeTypeId
	LEFT JOIN TotalInvoiceAmounts AS TIA ON TenantOffice.Id = TIA.TenantOfficeId
	LEFT JOIN TotalReceiptAmounts AS TRA ON TenantOffice.Id = TRA.TenantOfficeId
	WHERE (MED.Code = 'TOT_AROF')
	AND TenantOffice.RegionId = @RegionId;
END