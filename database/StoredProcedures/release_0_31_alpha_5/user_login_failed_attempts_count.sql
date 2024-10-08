CREATE OR ALTER PROCEDURE [dbo].[user_login_failed_attempts_count]
	@UserLoginId INT,
	@Attempts INT,
	@IsActive INT
AS
BEGIN 
	SET NOCOUNT ON;
	UPDATE UserLogin 
	SET 
		TotalFailedLoginAttempts=@Attempts,
		IsActive=@IsActive
	WHERE 
		Id= @UserLoginId;
END
