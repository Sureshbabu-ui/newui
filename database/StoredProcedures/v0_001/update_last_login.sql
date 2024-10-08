CREATE OR ALTER PROCEDURE [dbo].[update_last_login]
    @UserId INT
AS
BEGIN 
	SET NOCOUNT ON;
	UPDATE UserLogin
	SET 
		LastLoginOn =GETUTCDATE(),
		CurrentTokenVersion= ISNULL(CurrentTokenVersion,0)+1
	WHERE 
		Id = @UserId;
END 

