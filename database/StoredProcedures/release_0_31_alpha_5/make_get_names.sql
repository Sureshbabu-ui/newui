CREATE OR ALTER PROCEDURE [dbo].[make_get_names]
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id,
		[Name] 
	FROM Make
	WHERE 
		IsActive = 1
	ORDER BY [Name] ASC;
END 