CREATE OR ALTER PROCEDURE [dbo].[forgot_passcode_create_reset_code]
    @UserId INT,    
    @ResetCode INT,
	@ExpiryTime INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
	SELECT @ExpiryTime = AppValue  FROM AppSetting WHERE AppKey = 'OTPExpiryTime'
    INSERT INTO 
        UserResetPasscode
            (UserId,
            ResetCode,
            CreatedOn) 
    VALUES
        (@UserId,
        @ResetCode,
        GETUTCDATE())
END