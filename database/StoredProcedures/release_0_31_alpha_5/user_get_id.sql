CREATE OR ALTER PROCEDURE [dbo].[user_get_id]
    @Email VARCHAR(100),
    @UserId	INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	SET @UserId = (SELECT Id FROM UserInfo where Email=@Email AND IsActive=1 AND IsDeleted=0 )
IF @UserId IS NULL
	SET @UserId = 0
END 
