CREATE OR ALTER PROCEDURE [dbo].[user_get_login_history]
    @LoggedUserId INT
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT TOP 10 
        ClientInfo,
        CreatedOn,
        UserId ,
		LoggedOutOn
    FROM UserLoginHistory  
    WHERE  
        UserId=@LoggedUserId 
    ORDER BY CreatedOn DESC
END 