CREATE OR ALTER PROCEDURE [dbo].[bankbranch_delete]
    @Id INT,
	@DeletedBy INT,
	@IsRestricted BIT OUTPUT

AS
BEGIN
    SET NOCOUNT ON;
	BEGIN TRY
	-- If a constraint violation occurs, perform a soft delete
	
	BEGIN TRANSACTION
	 UPDATE BankBranchInfo
        SET 
            IsDeleted = 1,
            DeletedBy = @DeletedBy,
            DeletedOn = GETUTCDATE()
        WHERE 
            Id = @Id;
	COMMIT TRANSACTION;
	SET @IsRestricted = 0 

    -- Attempt to perform a hard delete
	
	BEGIN TRANSACTION
    DELETE FROM BankBranchInfo WHERE Id = @Id;
	COMMIT TRANSACTION;

    END TRY
    BEGIN CATCH
    IF ERROR_NUMBER() IN (547) -- 547 is the error number for foreign key constraint violation
    BEGIN
     SET @IsRestricted =1
    END

    END CATCH;
END;