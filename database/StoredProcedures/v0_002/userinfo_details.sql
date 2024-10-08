CREATE OR ALTER PROCEDURE [dbo].[userinfo_details]
    @EmployeeCode VARCHAR(32) = NULL,
    @UserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @PasswordExpiryPeriodInDays INT;
	SELECT @PasswordExpiryPeriodInDays = AppValue FROM AppSetting WHERE AppKey = 'PasswordExpiryPeriodInDays';

    SELECT 
        UI.Id, 
        UI.Fullname, 
        UI.Email, 
        UI.Phone, 
		UL.CurrentTokenVersion,
		UL.IsConcurrentLoginAllowed,
        UI.CreatedOn, 
		CASE
			WHEN UI.ExpiryDate < GETDATE() 
			THEN 1
			ELSE 0
		END AS IsUserExpired,
        UI.CreatedOn,
		CASE WHEN ((DATEDIFF(day, UL.PasscodeUpdatedOn, GETUTCDATE()) > @PasswordExpiryPeriodInDays) OR 
		(UL.PasscodeUpdatedOn IS NULL)) THEN 1 ELSE 0 END AS IsPasscodeExpired
    FROM UserInfo UI
	INNER JOIN UserLogin UL ON UL.Id = UI.UserLoginId
    WHERE 
        (@EmployeeCode IS NOT NULL AND EmployeeCode = @EmployeeCode) OR
        (@UserId IS NOT NULL AND 
        UI.Id = @UserId);
END;