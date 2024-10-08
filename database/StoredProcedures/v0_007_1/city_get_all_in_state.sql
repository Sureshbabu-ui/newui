CREATE OR ALTER PROCEDURE [dbo].[city_get_all_in_state]
    @StateId INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id,
		[Name],
		TenantOfficeId
	FROM City 
	WHERE 
		City.StateId=@StateId AND 
		IsActive=1;
END 