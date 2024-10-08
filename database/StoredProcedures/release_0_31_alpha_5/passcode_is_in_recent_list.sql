CREATE OR ALTER PROCEDURE [dbo].[passcode_is_in_recent_list]
	@UserId		INT = NULL,
	@EmployeeCode VARCHAR(100) = NULL
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @UserLoginId INT;

	IF (@EmployeeCode IS NOT NULL)
	BEGIN
		SET @UserId = 
		(SELECT 
			Id 
		FROM 
			UserInfo 
		WHERE EmployeeCode = @EmployeeCode AND 
			  IsActive = 1 
			  AND IsDeleted = 0);
	END

	SET @UserLoginId = 
	(SELECT 
		UserLoginId 
	FROM 
		UserInfo 
	WHERE EmployeeCode = @EmployeeCode AND 
		  IsActive = 1 AND 
		  IsDeleted = 0);
	
	-- recent passwords of the given user
	((SELECT 
		Passcode 
	FROM 
		UserPasscodeHistory 
	WHERE 
		UserId=@UserId) 
	UNION ALL 
	SELECT 
		Passcode 
	FROM 
		UserLogin 
	WHERE 
		Id=@UserLoginId)
END 

