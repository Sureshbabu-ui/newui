CREATE OR ALTER PROCEDURE [dbo].[userlogin_passcode_expiry_notice]
    @LoggedUserId INT 
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PasswordExpiryNoticeInDays INT;
    DECLARE @PasswordExpiryPeriodInDays INT;
    DECLARE @PasscodeUpdatedOn DATETIME;
    DECLARE @ExpiryDate DATETIME;
    DECLARE @DaysUntilExpiry INT;

    SELECT @PasswordExpiryNoticeInDays = AppValue FROM AppSetting WHERE AppKey = 'PasswordExpiryNoticeInDays';
    SELECT @PasswordExpiryPeriodInDays = AppValue FROM AppSetting WHERE AppKey = 'PasswordExpiryPeriodInDays';
    SELECT @PasscodeUpdatedOn = PasscodeUpdatedOn FROM UserLogin WHERE Id = @LoggedUserId;

    -- Calculate the expiry date and the number of days until expiry
    SET @ExpiryDate = DATEADD(day, @PasswordExpiryPeriodInDays, @PasscodeUpdatedOn);
    SET @DaysUntilExpiry = DATEDIFF(day, GETUTCDATE(), @ExpiryDate);

    -- Check if notification is needed and return the relevant information
    IF @DaysUntilExpiry <= @PasswordExpiryNoticeInDays AND @DaysUntilExpiry >= 0
    BEGIN
        SELECT DaysUntilExpiry = @DaysUntilExpiry;
    END
END;