CREATE OR ALTER PROCEDURE [dbo].[contractdashboard_collectionoutstanding_info]
    @DateFrom VARCHAR(64) = NULL,
    @DateTo VARCHAR(64) = NULL,
    @TenantRegionId INT = NULL,
    @TenantOfficeId INT = NULL,
	@TotalOutstandingAmount INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
	
	IF @DateTo IS NULL OR @DateTo = ''
    BEGIN
        SET @DateTo = CAST(GETUTCDATE() AS DATE);
    END

	SELECT 
	 @TotalOutstandingAmount = SUM(IR.OutstandingAmount)
    FROM InvoiceReconciliation IR
    LEFT JOIN Invoice I on I.Id = IR.InvoiceId
	LEFT JOIN ContractInvoice ON ContractInvoice.InvoiceId =I.Id
	LEFT JOIN [Contract] C ON C.Id=ContractInvoice.ContractId
	LEFT JOIN TenantOffice TOC ON TOC.Id =C.TenantOfficeId
	LEFT JOIN TenantRegion TR ON TR.Id=TOC.RegionId
	WHERE (@DateFrom IS NULL OR CAST(I.InvoiceDate AS DATE) >= @DateFrom)
        AND (CAST(I.InvoiceDate AS DATE) <= @DateTo)
	      AND OutstandingAmount != 0 
          AND (@TenantRegionId IS NULL OR TOC.RegionId = @TenantRegionId)
          AND (@TenantOfficeId IS NULL OR C.TenantOfficeId = @TenantOfficeId)
END