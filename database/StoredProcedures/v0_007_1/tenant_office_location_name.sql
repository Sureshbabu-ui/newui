CREATE OR ALTER PROCEDURE [dbo].[tenant_office_location_name]
@TenantOfficeId INT = NULL
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		T.Id,
		T.OfficeName,
		TOI.[Address]
	FROM TenantOffice T
	LEFT JOIN TenantOfficeInfo TOI ON TOI.TenantOfficeId = T.Id AND TOI.EffectiveTo IS NULL
	WHERE (@TenantOfficeId IS NULL OR T.Id = @TenantOfficeId)
END 