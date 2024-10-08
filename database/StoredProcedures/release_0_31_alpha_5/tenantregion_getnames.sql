CREATE OR ALTER PROCEDURE [dbo].[tenantregion_getnames]
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id,
		RegionName,
		Code 
	FROM TenantRegion 
	WHERE 
		IsActive=1
END 