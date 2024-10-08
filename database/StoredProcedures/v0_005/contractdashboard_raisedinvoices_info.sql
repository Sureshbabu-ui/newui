CREATE OR ALTER PROCEDURE [dbo].[contractdashboard_raisedinvoices_info]
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
         @TotalRows = COUNT(CI.Id)
    FROM ContractInvoice CI 
		LEFT JOIN [Contract] C ON C.Id = CI.ContractId
		LEFT JOIN Invoice I ON I.Id = CI.InvoiceId
		LEFT JOIN TenantOffice T ON T.Id = C.TenantOfficeId
    WHERE (@DateFrom IS NULL OR CAST(I.CreatedOn AS DATE) >= @DateFrom)
        AND (CAST(I.CreatedOn AS DATE) <= @DateTo)
        AND (@TenantRegionId IS NULL OR T.RegionId = @TenantRegionId)
        AND (@TenantOfficeId IS NULL OR C.TenantOfficeId = @TenantOfficeId)
END;