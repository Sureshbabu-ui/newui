CREATE OR ALTER PROCEDURE [dbo].[contractdashboard_collectionmade_info]
    @DateFrom DATE = NULL,
    @DateTo DATE = NULL,
    @TenantRegionId INT = NULL,
    @TenantOfficeId INT = NULL,
    @TotalCollectedAmount INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
	
	IF @DateTo IS NULL OR @DateTo = ''
    BEGIN
        SET @DateTo = CAST(GETUTCDATE() AS DATE);
    END

	SELECT 
		@TotalCollectedAmount = SUM(IR.CollectedAmount)
    FROM InvoiceReconciliation IR
		LEFT JOIN Invoice I on I.Id = IR.InvoiceId
		LEFT JOIN InvoiceReceipt IRT ON IRT.InvoiceId = I.Id
		LEFT JOIN Receipt R ON R.Id = IRT.ReceiptId
		LEFT JOIN ContractInvoice ON ContractInvoice.InvoiceId =I.Id
		LEFT JOIN [Contract] C ON C.Id = ContractInvoice.ContractId
		INNER JOIN BankCollection BC ON BC.Id = R.BankCollectionId
		LEFT JOIN TenantOffice TOC ON TOC.Id =C.TenantOfficeId
		LEFT JOIN TenantRegion TR ON TR.Id=TOC.RegionId
	WHERE (@DateFrom IS NULL OR CAST(BC.TransactionDate AS DATE) >= @DateFrom)
        AND (CAST(BC.TransactionDate AS DATE) <= @DateTo)
        AND (@TenantRegionId IS NULL OR TOC.RegionId = @TenantRegionId)
        AND (@TenantOfficeId IS NULL OR C.TenantOfficeId = @TenantOfficeId)		 
END