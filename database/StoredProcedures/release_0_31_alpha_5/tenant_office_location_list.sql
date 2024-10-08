CREATE OR ALTER PROCEDURE [dbo].[tenant_office_location_list]
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id,
		[Address] 
	FROM TenantOfficeInfo 
	WHERE 
		IsVerified=1 AND  
		EffectiveTo IS NULL;
END 