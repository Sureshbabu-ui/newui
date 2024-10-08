CREATE OR ALTER PROCEDURE [dbo].[city_get_all_with_state]
AS
BEGIN 
SET NOCOUNT ON;
	SELECT 
		Id,
		StateId,
		[Name],
		TenantOfficeId
	FROM City
	WHERE 
		IsActive = 1;
END