CREATE OR ALTER PROCEDURE [dbo].[service_engineers_list]
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id,
		FullName 
	FROM UserInfo 
	WHERE 
		IsDeleted = 0
END 