CREATE OR ALTER PROCEDURE [dbo].[role_delete]
    @Id INT,
    @DeletedBy INT,
    @IsRoleDeleted INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET @IsRoleDeleted = 0;  
	BEGIN TRY    
    -- If a constraint violation occurs, perform a soft delete
    BEGIN TRANSACTION
    UPDATE
        Role
    SET
        IsDeleted = 1,
        DeletedBy = @DeletedBy,
        DeletedOn = GETUTCDATE()
    WHERE
        Id = @Id AND IsSystemRole = 0;
    COMMIT TRANSACTION;

    -- Attempt to perform a hard delete
    BEGIN TRANSACTION
    DELETE FROM [Role] WHERE Id = @Id AND IsSystemRole = 0;
    COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
    -- Check if the error is a foreign key constraint violation
    IF ERROR_NUMBER() = 547
    BEGIN
    	SET @IsRoleDeleted =1
    END
    END CATCH;
END;