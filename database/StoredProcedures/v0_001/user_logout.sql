CREATE OR ALTER PROCEDURE [dbo].[user_logout]
    @UserId INT,
	@TokenVersion INT
AS
BEGIN 
	SET NOCOUNT ON;
	UPDATE UserLoginHistory
	SET 
		LoggedOutOn =GETUTCDATE()
	WHERE 
		UserId = @UserId AND TokenVersion = @TokenVersion;
END 

