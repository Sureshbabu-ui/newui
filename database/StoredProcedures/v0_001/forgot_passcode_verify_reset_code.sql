CREATE OR ALTER   PROCEDURE [dbo].[forgot_passcode_verify_reset_code]
    @EmployeeCode VARCHAR(100),
    @Code INT,
    @IsValid BIT OUTPUT,
    @IsExpired BIT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	SET XACT_ABORT ON; 
	BEGIN TRANSACTION
	DECLARE @VerifiedCodeId INT;    
	DECLARE @ExpiryTime INT;    

	SELECT @ExpiryTime = AppValue  FROM AppSetting WHERE AppKey = 'OTPExpiryTime'
-- First, check if the code exists and is associated with the user
	SET @VerifiedCodeId = (
		SELECT TOP 1 Id
		FROM UserResetPasscode
		WHERE ResetCode = @Code 
		  AND UserId = (
			  SELECT Id
			  FROM UserInfo
			  WHERE EmployeeCode = @EmployeeCode 
				AND IsActive = 1 
				AND IsDeleted = 0
		  ) 
		  AND VerifiedOn IS NULL
		ORDER BY CreatedOn DESC
	);

	IF @VerifiedCodeId IS NOT NULL
	BEGIN
		SET @IsValid = 1;
		SET @IsExpired = 0;
		-- If a code is found, check if it is expired
		DECLARE @CreatedOn DATETIME;
		SET @CreatedOn = (
			SELECT CreatedOn
			FROM UserResetPasscode
			WHERE Id = @VerifiedCodeId
		);

		IF DATEADD(MINUTE, @ExpiryTime, @CreatedOn) >= GETUTCDATE()
		BEGIN
			-- Code is valid and not expired
        UPDATE 
			UserResetPasscode 
		SET VerifiedOn = GETUTCDATE() 
		WHERE 
			Id=@VerifiedCodeId
		END
		ELSE
		BEGIN
			-- Code is expired
			SET @IsExpired = 1;
		END
	END
	ELSE
	BEGIN
		-- No valid code found, mark it as invalid
		SET @IsValid = 0;
		SET @IsExpired = 1;
	END	
	COMMIT TRANSACTION
END 