CREATE OR ALTER   PROCEDURE [dbo].[collection_made_bargraph_detail]
    @RegionId    INT = NULL,
    @StartDate      DATE ,
    @EndDate		DATE
AS
BEGIN 
		SET NOCOUNT ON;
		IF(@RegionId IS NULL)
		WITH RegionReceipts AS (
		SELECT TR.Code,
				ISNULL(SUM(R.ReceiptAmount), 0) AS Amount
		FROM Receipt R
		INNER JOIN InvoiceReceipt IR ON R.Id = IR.ReceiptId
		INNER JOIN ContractInvoice CI ON IR.InvoiceId = CI.InvoiceId
		INNER JOIN Contract C ON CI.ContractId = C.Id
		INNER JOIN TenantOffice T ON C.TenantOfficeId = T.Id 
		INNER JOIN MasterEntityData MED ON MED.Id = T.OfficeTypeId 
		INNER JOIN TenantRegion TR ON T.RegionId = TR.Id
		WHERE (MED.Code = 'TOT_AROF') AND (R.ReceiptDate BETWEEN  @StartDate AND @EndDate)
		GROUP BY TR.Code
		)
		SELECT TR.Code, ISNULL(RR.Amount, 0) AS Amount
		FROM TenantRegion TR
		LEFT JOIN RegionReceipts AS RR ON TR.Code = RR.Code;
		ELSE
		WITH OfficeReceipts AS (
			SELECT TenantOfficeId, SUM(IR.Amount) AS Amount
			FROM Receipt
			INNER JOIN InvoiceReceipt IR ON IR.ReceiptId = Receipt.Id
			INNER JOIN ContractInvoice CI ON IR.InvoiceId = CI.InvoiceId
			INNER JOIN Contract C ON CI.ContractId = C.Id
			WHERE Receipt.ReceiptDate BETWEEN @StartDate AND @EndDate
			GROUP BY TenantOfficeId
		)
		SELECT
			TenantOffice.Code,
			ISNULL(ORS.Amount, 0) AS Amount
		FROM TenantOffice
		INNER JOIN MasterEntityData MED ON MED.Id = TenantOffice.OfficeTypeId
		LEFT JOIN OfficeReceipts AS ORS ON TenantOffice.Id = ORS.TenantOfficeId
		WHERE  (MED.Code = 'TOT_AROF') AND
			TenantOffice.RegionId = @RegionId;
END