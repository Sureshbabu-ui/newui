CREATE OR ALTER PROCEDURE [dbo].[user_passcode_validate_expiry]
    @EmployeeCode VARCHAR(32) = NULL,
    @LoggedUserId INT = NULL,
    @IsPasscodeExpired BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @PasswordExpiryPeriodInDays INT;
	SELECT @PasswordExpiryPeriodInDays = AppValue FROM AppSetting WHERE AppKey = 'PasswordExpiryPeriodInDays';

	SET @IsPasscodeExpired = (
		SELECT CASE 
			WHEN DATEDIFF(day, UL.PasscodeUpdatedOn, GETUTCDATE()) > @PasswordExpiryPeriodInDays THEN 1 
			ELSE 0 
		END
		FROM UserInfo UI
		LEFT JOIN UserLogin UL ON UL.Id = UI.UserLoginId
		WHERE 
			(@EmployeeCode IS NOT NULL AND UI.EmployeeCode = @EmployeeCode) OR
			(@LoggedUserId IS NOT NULL AND UI.Id = @LoggedUserId)
		);
END