CREATE OR ALTER PROCEDURE [dbo].[part_delete]
    @Id INT,
    @DeletedBy INT,
    @IsRestricted BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET @IsRestricted = 0;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Attempt to perform soft delete
        UPDATE Part 
        SET IsDeleted = 1,
            DeletedBy = @DeletedBy,
            DeletedOn = GETUTCDATE()
        WHERE Id = @Id;

        -- Attempt to perform hard delete
        DELETE FROM Part WHERE Id = @Id;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Check if the error is a foreign key constraint violation
        IF ERROR_NUMBER() = 547
        BEGIN
            SET @IsRestricted = 1;
        END
    END CATCH;
END;