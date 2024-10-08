CREATE OR ALTER PROCEDURE [dbo].[user_status]
	@UserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        IsActive 
    FROM UserLogin 
    WHERE Id=(SELECT UserLoginId FROM UserInfo WHERE Id=@UserId);
END
