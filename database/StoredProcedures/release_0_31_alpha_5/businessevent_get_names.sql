CREATE OR ALTER PROCEDURE [dbo].[businessevent_get_names] 
AS
BEGIN
	SELECT 
		Id,
		[Name]
	FROM BusinessEvent 
	WHERE 
		IsActive=1
	ORDER BY [Name] ASC;
END