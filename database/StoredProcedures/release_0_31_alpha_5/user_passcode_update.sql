CREATE OR ALTER PROCEDURE [dbo].[user_passcode_update]
	@UserId INT = NULL,
	@Passcode CHAR(500),
	@IsActive BIT

AS
BEGIN
	SET NOCOUNT ON;
	SET XACT_ABORT ON;
	DECLARE	@CountOfUserPasscodesInHistoryTable INT
	DECLARE		@CurrentUserPasscode CHAR(500)
	DECLARE		@UserLoginId INT
	
		SET @UserLoginId = (SELECT UserLoginId FROM UserInfo WHERE Id=@UserId)
		SET @CurrentUserPasscode = (SELECT Passcode FROM UserLogin WHERE Id=@UserLoginId)
	BEGIN TRANSACTION

		INSERT INTO UserPasscodeHistory(UserId,Passcode,CreatedOn) VALUES(@UserId,@CurrentUserPasscode,GETDATE())
		-- check count of rows in UserPasscodeHistory and delete if having more than N rows
 SET @CountOfUserPasscodesInHistoryTable = (SELECT count(UserId) FROM UserPasscodeHistory WHERE UserId=@UserId)
 IF(@CountOfUserPasscodesInHistoryTable > 2)
	DELETE FROM UserPasscodeHistory WHERE Id=(SELECT Id FROM UserPasscodeHistory WHERE UserId=@UserId ORDER BY Id ASC OFFSET 0 rows FETCH FIRST 1 ROW ONLY)

		-- update passcode
 UPDATE UserLogin 
		SET Passcode=@Passcode,IsActive=@IsActive, PasscodeUpdatedOn=GETDATE() ,TotalFailedLoginAttempts = NULL
		WHERE Id=@UserLoginId 

		-- update UserResetPasscode
		SET @IsActive = 1;
 COMMIT TRANSACTION;
 END
  
