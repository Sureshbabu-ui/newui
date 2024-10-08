CREATE OR ALTER   PROCEDURE [dbo].[tenant_office_info_count] 
	@SearchWith  VARCHAR(50) = NULL,
	@TotalRows INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @TenantOfficeTypeId INT;
	SELECT @TenantOfficeTypeId = Id FROM MasterEntityData WHERE Code = 'TOT_AROF'
	SELECT
		@TotalRows = COUNT(TOI.Id)
	FROM TenantOfficeInfo TOI
		JOIN TenantOffice ON TOI.TenantOfficeId = TenantOffice.Id
	WHERE
		(@SearchWith IS NULL OR 
		TenantOffice.RegionId = @SearchWith) AND 
		TenantOffice.OfficeTypeId = @TenantOfficeTypeId
END