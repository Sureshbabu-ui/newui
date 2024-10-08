CREATE OR ALTER PROCEDURE [dbo].[customergroup_delete]
    @Id INT,
	@DeletedBy INT,
	@IsRestricted BIT OUTPUT

AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET @IsRestricted = 0;  
    BEGIN TRY    
    -- If a constraint violation occurs, perform a soft delete
    BEGIN TRANSACTION
    UPDATE
        CustomerGroup
    SET
        IsDeleted = 1,
        DeletedBy = @DeletedBy,
        DeletedOn = GETUTCDATE()
    WHERE
        Id = @Id;
    COMMIT TRANSACTION;

    -- Attempt to perform a hard delete
    BEGIN TRANSACTION
    DELETE FROM CustomerGroup WHERE Id = @Id;
    COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
    -- Check if the error is a foreign key constraint violation
    IF ERROR_NUMBER() = 547
    BEGIN
    	SET @IsRestricted =1
    END
    END CATCH;
END;