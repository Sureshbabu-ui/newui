CREATE OR ALTER PROCEDURE [dbo].[passcode_update]
    @UserId INT=NULL,
    @Passcode CHAR(500),
    @EmployeeCode VARCHAR(100)=NULL,
    @Code INT=NULL,
    @IsPasscodeUpdated INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	SET XACT_ABORT ON; 
    BEGIN TRANSACTION
	DECLARE   	@CountOfUserPasscodesInHistoryTable INT
    DECLARE   	@UserLoginId INT
    DECLARE		@CurrentUserPasscode char(500)    
	
        IF (@EmployeeCode IS NOT NULL)
            SET @UserId = (SELECT Id FROM UserInfo WHERE EmployeeCode=@EmployeeCode);        
		
		SET @UserLoginId = (SELECT UserLoginId FROM UserInfo WHERE Id=@UserId)
        SET @CurrentUserPasscode = (SELECT Passcode FROM UserLogin WHERE Id=@UserLoginId)         

		-- move current passcode to the history table
        INSERT INTO UserPasscodeHistory(UserId, Passcode, CreatedOn) VALUES(@UserId,@CurrentUserPasscode,GETUTCDATE())
		-- check count of rows in UserPasscodeHistory and delete if having more than N rows
        SET @CountOfUserPasscodesInHistoryTable = (SELECT count(UserId) FROM UserPasscodeHistory WHERE UserId=@UserId)
        IF(@CountOfUserPasscodesInHistoryTable > 2)
        	DELETE FROM UserPasscodeHistory WHERE Id=(SELECT Id FROM UserPasscodeHistory WHERE UserId=@UserId ORDER BY Id ASC OFFSET 0 rows FETCH  FIRST 1 ROW ONLY)

		-- update passcode
        UPDATE UserLogin SET Passcode=@Passcode,PasscodeUpdatedOn=GETUTCDATE() WHERE Id=@UserLoginId AND IsActive=1         

		-- update UserResetPasscode
        IF (@Code IS NOT NULL)
            UPDATE UserResetPasscode SET PasscodeUpdatedOn=GETUTCDATE() WHERE UserId=@UserId AND ResetCode = @Code

        SET @IsPasscodeUpdated = 1;
  COMMIT TRANSACTION 
END
