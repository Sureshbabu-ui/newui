CREATE OR ALTER PROCEDURE [dbo].[user_passcode_is_in_recent_list]
	@UserId INT = NULL
AS
BEGIN 
    SET NOCOUNT ON;
	DECLARE @UserLoginId INT;
	SET @UserLoginId = (SELECT UserLoginId FROM UserInfo WHERE Id=@UserId);
	-- recent passwords of the given user
	((SELECT 
		Passcode 
	FROM UserPasscodeHistory 
	WHERE 
		UserId=@UserId) 
	UNION ALL 
	SELECT 
		Passcode 
	FROM UserLogin 
	WHERE 
		Id=@UserLoginId)
END