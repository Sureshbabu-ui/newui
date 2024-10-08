CREATE OR ALTER PROCEDURE [dbo].[state_get_all_in_country]
    @CountryId int
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id,
		[Name] 
	FROM [State] 
	WHERE 
		[State].CountryId=@CountryId AND 
		IsActive=1;
END 