
CREATE OR ALTER     PROCEDURE [dbo].[user_delete]
    @UserIdList	VARCHAR(MAX),
    @DeletedBy	INT
AS
BEGIN 
	SET NOCOUNT ON;
	SET XACT_ABORT ON;
 
	-- Get the current date and time
    DECLARE @Year NVARCHAR(2) = RIGHT(CONVERT(VARCHAR(4), YEAR(GETDATE())), 2);
    DECLARE @Month NVARCHAR(2) = RIGHT('0' + CONVERT(VARCHAR(2), MONTH(GETDATE())), 2);
    DECLARE @Day NVARCHAR(2) = RIGHT('0' + CONVERT(VARCHAR(2), DAY(GETDATE())), 2);
    DECLARE @Hour NVARCHAR(2) = RIGHT('0' + CONVERT(VARCHAR(2), DATEPART(HOUR, GETDATE())), 2);
    DECLARE @Minute NVARCHAR(2) = RIGHT('0' + CONVERT(VARCHAR(2), DATEPART(MINUTE, GETDATE())), 2);
 
	BEGIN TRANSACTION
 
    UPDATE  UserInfo
	SET 
		IsActive = 0,
		IsDeleted  = 1,
		EmployeeCode = EmployeeCode+@Year+@Month+@Day+@Hour+@Minute,
		DeletedBy = @DeletedBy,
		DeletedOn = GETUTCDATE() 
	WHERE 
		Id IN (SELECT VALUE FROM STRING_SPLIT(@UserIdList,','));

		 UPDATE  ServiceEngineerInfo
	SET 
		IsActive = 0,
		IsDeleted  = 1,
		DeletedBy = @DeletedBy,
		DeletedOn = GETUTCDATE() 
	WHERE 
	UserInfoId IN (SELECT VALUE FROM STRING_SPLIT(@UserIdList,','));
 
	UPDATE  UserLogin
	SET 
		IsActive  = 0,
		UserName = UserName+@Year+@Month+@Day+@Hour+@Minute,
		DeactivatedBy = @DeletedBy,
		DeactivatedOn = GETUTCDATE() 
    WHERE Id IN (SELECT UserLoginId FROM UserInfo WHERE Id IN (SELECT VALUE FROM STRING_SPLIT(@UserIdList, ',')));
 
	COMMIT TRANSACTION
END 
