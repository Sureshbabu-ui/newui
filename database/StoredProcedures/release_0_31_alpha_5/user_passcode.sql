CREATE OR ALTER PROCEDURE [dbo].[user_passcode]
    @UserId INT
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        Id, 
        Passcode 
    FROM UserLogin 
    WHERE 
        Id=(SELECT UserLoginId FROM UserInfo WHERE Id=@UserId AND IsDeleted=0 AND IsActive=1) AND IsActive=1;
END

