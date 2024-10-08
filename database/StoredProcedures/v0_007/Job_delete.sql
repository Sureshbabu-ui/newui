CREATE OR ALTER       PROCEDURE [dbo].[job_delete]
		@Id int
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
	  BEGIN TRY    
    -- Attempt to perform a hard delete
    BEGIN TRANSACTION
    DELETE FROM Job WHERE Id = @Id;
    COMMIT TRANSACTION;
    END TRY
     BEGIN CATCH
        -- Rollback any active transaction in case of an error
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
    END CATCH;
END;
