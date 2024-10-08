CREATE OR ALTER PROCEDURE [dbo].[userlogin_disable_inactive_users]
AS
BEGIN
	SET NOCOUNT ON;
	UPDATE UserLogin 
	SET 
		IsActive=0, 
		DeactivatedOn=GETUTCDATE() 
	WHERE 
		(((LastLoginOn IS NOT NULL) AND 
		(DATEDIFF(day, LastLoginOn, GETUTCDATE()) >= 30)) OR 
		((LastLoginOn IS NULL) AND 
		(DATEDIFF(day, CreatedOn, GETUTCDATE()) >= 30))) AND 
		IsActive=1
END