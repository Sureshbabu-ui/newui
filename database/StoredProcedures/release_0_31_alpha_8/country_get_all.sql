CREATE OR ALTER    PROCEDURE [dbo].[country_get_all]
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id,
		[Name],
		CallingCode
	FROM Country 
	WHERE 
		IsActive=1;
END 