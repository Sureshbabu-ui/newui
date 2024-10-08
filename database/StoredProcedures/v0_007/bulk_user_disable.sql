
CREATE OR ALTER   PROCEDURE [dbo].[bulk_user_disable]
	@UserIdList VARCHAR(MAX),
	@LoggedUserId INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRANSACTION

    -- Disable users in UserInfo table
    UPDATE UserInfo 
    SET IsActive = 0, 
        ModifiedOn = GETUTCDATE(),
        ModifiedBy = @LoggedUserId 
    WHERE Id IN (SELECT VALUE FROM STRING_SPLIT(@UserIdList, ','));

	 -- Disable users in ServiceEngineerInfo table
	UPDATE  ServiceEngineerInfo
	SET 
		IsActive = 0,
		UpdatedBy = @LoggedUserId,
		UpdatedOn = GETUTCDATE() 
	WHERE 
		UserInfoId IN (SELECT VALUE FROM STRING_SPLIT(@UserIdList, ','));

    -- Disable corresponding UserLogin entries
    UPDATE UserLogin 
    SET IsActive = 0, 
        DeactivatedOn = GETUTCDATE(),
        DeactivatedBy = @LoggedUserId 
    WHERE Id IN (SELECT UserLoginId FROM UserInfo WHERE Id IN (SELECT VALUE FROM STRING_SPLIT(@UserIdList, ',')));

    COMMIT TRANSACTION
END;
