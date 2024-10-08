CREATE OR ALTER PROCEDURE [dbo].[division_get_names]
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id,
		[Name] 
	FROM Division 
	WHERE 
		IsActive =1
	ORDER BY [Name] ASC;
END 