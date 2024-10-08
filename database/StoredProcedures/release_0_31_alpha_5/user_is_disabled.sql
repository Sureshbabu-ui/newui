CREATE OR ALTER PROCEDURE [dbo].[user_is_disabled]
	@UserId INT,
	@IsUserDisabled INT OUTPUT
AS
BEGIN 
SET NOCOUNT ON;
	SET @IsUserDisabled = (SELECT IsDeleted FROM Users WHERE Id=@UserId)
IF @IsUserDisabled IS NULL
    SET @IsUserDisabled = 1
END