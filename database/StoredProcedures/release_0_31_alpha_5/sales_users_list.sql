CREATE OR ALTER PROCEDURE [dbo].[sales_users_list]
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