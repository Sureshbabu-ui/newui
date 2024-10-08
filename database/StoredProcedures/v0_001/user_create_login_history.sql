CREATE OR ALTER PROCEDURE [dbo].[user_create_login_history]
    @UserId INT,
    @ClientInfo VARCHAR(1024),
	@TokenVersion INT,
    @LoginTime DATETIME OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON; 
	BEGIN TRANSACTION
	DECLARE @LastInsertedId INT;
    DECLARE @CountOfUserLoginHistoryItems INT;   
	DECLARE @MaximumAllowedRows INT;
    SET @LoginTime = GETUTCDATE();
	SELECT @MaximumAllowedRows = AppValue FROM AppSetting WHERE AppKey = 'MaximumLoginHistoryCount';
    
    INSERT INTO UserLoginHistory 
        (UserId, 
        ClientInfo, 
		TokenVersion,
        CreatedOn)
    VALUES 
        (@UserId, 
        @ClientInfo, 
		@TokenVersion,
        @LoginTime);

	/*delete data from table when n=1th number of log history occure*/
    SET @CountOfUserLoginHistoryItems = (SELECT COUNT(UserId) FROM UserLoginHistory WHERE UserId = @UserId);
    IF (@CountOfUserLoginHistoryItems > @MaximumAllowedRows)
    BEGIN
        SET @LastInsertedId = (SELECT TOP 1 Id FROM UserLoginHistory WHERE UserId = @UserId ORDER BY Id ASC);
        DELETE FROM UserLoginHistory WHERE Id = @LastInsertedId;
    END
	COMMIT TRANSACTION
END