CREATE OR ALTER   PROCEDURE [dbo].[designation_get_names]
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id,
		[Name],
		Code
	FROM Designation
	WHERE 
		IsActive = 1
	ORDER BY [Name] ASC;
END 