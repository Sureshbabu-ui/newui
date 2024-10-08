CREATE OR ALTER PROCEDURE [dbo].[contractdashboard_invoicecollection_outstanding_info]
    @DateFrom DATE = NULL,
    @DateTo DATE = NULL,
    @TenantRegionId INT = NULL,
    @TenantOfficeId INT = NULL,
	@TotalRows INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
	IF @DateTo IS NULL OR @DateTo = ''
    BEGIN
        SET @DateTo = CAST(GETUTCDATE() AS DATE);
    END

    SELECT 
         @TotalRows = COUNT(IR.Id)
    FROM InvoiceReconciliation IR
		LEFT JOIN ContractInvoice CI ON CI.InvoiceId = IR.InvoiceId
		LEFT JOIN [Contract] C ON C.Id = CI.ContractId
		LEFT JOIN TenantOffice T ON T.Id = C.TenantOfficeId
    WHERE (@DateFrom IS NULL OR CAST(IR.CreatedOn AS DATE) >= @DateFrom)
        AND (CAST(IR.CreatedOn AS DATE) <= @DateTo)
        AND (@TenantRegionId IS NULL OR T.RegionId = @TenantRegionId)
        AND (@TenantOfficeId IS NULL OR C.TenantOfficeId = @TenantOfficeId)
		AND (IR.OutstandingAmount - IR.WriteOffAmount = 0 )
END;