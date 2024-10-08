
CREATE OR ALTER   PROCEDURE [dbo].[user_toggle_status]
    @Id INT = 0,
    @IsActive BIT = NULL,
    @LoggedUserId INT = 0
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRANSACTION;

    UPDATE UserInfo 
    SET IsActive = CASE WHEN @IsActive = 1 THEN 0 ELSE 1 END, 
        ModifiedOn = GETUTCDATE(),
        ModifiedBy = @LoggedUserId 
    WHERE Id = @Id;

	UPDATE  ServiceEngineerInfo
	SET 
		IsActive = CASE WHEN @IsActive = 1 THEN 0 ELSE 1 END,
		UpdatedBy = @LoggedUserId,
		UpdatedOn = GETUTCDATE() 
	WHERE 
		UserInfoId =@Id

	  UPDATE UserLogin 
        SET IsActive = CASE WHEN @IsActive = 1 THEN 0 ELSE 1 END, 
            DeactivatedOn = NULL,
            DeactivatedBy = NULL 
        WHERE Id IN (SELECT UserLoginId FROM UserInfo WHERE Id = @Id);
    COMMIT TRANSACTION;
END;
