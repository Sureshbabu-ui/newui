CREATE OR ALTER PROCEDURE [dbo].[forgot_passcode_validate_reset_code]
	@EmployeeCode VARCHAR(64),
	@Code INT,
	@IsCodeValid INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE	@RecordsCount INT
	DECLARE	@UserId INT

	SET @IsCodeValid = 0;

	SET @UserId = (SELECT 
							Id 
					FROM	UserInfo 
					WHERE	EmployeeCode=@EmployeeCode AND IsActive = 1 AND IsDeleted = 0);

	IF @UserId IS NOT NULL
	BEGIN
		-- validate the given code, email combination
		SET @RecordsCount = (
			SELECT 
				count(id) 
			FROM	
				UserResetPasscode 
			WHERE	
				UserId=(@UserId) AND 
				ResetCode=@Code AND 
				VerifiedOn IS NOT NULL AND
				PasscodeUpdatedOn IS NULL)
	END

	IF (@RecordsCount = 1)
		SET @IsCodeValid = 1;
END