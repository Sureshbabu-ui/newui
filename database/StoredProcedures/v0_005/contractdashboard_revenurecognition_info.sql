CREATE OR ALTER PROCEDURE [dbo].[contractdashboard_revenurecognition_info]
    @DateFrom DATE = NULL,
    @DateTo DATE = NULL,
    @TenantRegionId INT = NULL,
    @TenantOfficeId INT = NULL,
	@TotalValue INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF @DateTo IS NULL
    SET @DateTo = GETUTCDATE();

    SELECT 
         @TotalValue = COUNT(C.ContractValue)
    FROM Contract C
		LEFT JOIN TenantOffice T ON T.Id = C.TenantOfficeId
		LEFT JOIN MasterEntityData  CS ON CS.Id = C.ContractStatusId
    WHERE CS.[Code] = 'CTS_APRV' 
		AND (@DateFrom IS NULL OR [BookingDate] >= @DateFrom)
        AND ([BookingDate] <= @DateTo)
        AND (@TenantRegionId IS NULL OR T.RegionId = @TenantRegionId)
        AND (@TenantOfficeId IS NULL OR C.TenantOfficeId = @TenantOfficeId)
		AND C.IsDeleted = 0;
END;