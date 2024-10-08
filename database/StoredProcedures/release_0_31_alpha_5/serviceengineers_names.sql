CREATE OR ALTER PROCEDURE [dbo].[serviceengineers_names]
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		U.Id,
		FullName,
		UserRole.RoleId 
	FROM UserInfo U
	JOIN UserRole ON UserRole.UserId = U.Id 
	WHERE 
		U.IsDeleted = 0 AND
	/*TODO: Need to change this condition UserRole.RoleId = 20 , because that id can be change*/
	    UserRole.RoleId = 20 --Service Engineer Role Id
END 
