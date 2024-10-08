CREATE OR ALTER PROCEDURE [dbo].[customer_delete]
    @CustomerId INT,
    @DeletedBy INT,
    @IsRestricted INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Begin transaction
        BEGIN TRANSACTION;

        -- Soft delete by marking IsDeleted = 1
        UPDATE CustomerInfo
        SET 
            IsDeleted = 1,
            DeletedBy = @DeletedBy,
            DeletedOn = GETUTCDATE()
        WHERE CustomerId = @CustomerId;

		UPDATE CustomerSite
        SET 
            IsDeleted = 1,
            DeletedBy = @DeletedBy,
            DeletedOn = GETUTCDATE()
        WHERE CustomerId = @CustomerId;

        -- Hard delete from CustomerInfo and Customer
		DELETE FROM CustomerSite WHERE CustomerId = @CustomerId;
        DELETE FROM CustomerInfo WHERE CustomerId = @CustomerId;
        DELETE FROM Customer WHERE Id = @CustomerId;

        -- If we reach this point, set IsRestricted as successful
        SET @IsRestricted = 0;

        -- Commit the transaction
        COMMIT TRANSACTION;
    END TRY

    BEGIN CATCH
        -- Check for any active transaction, rollback if exists
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Set the output variable to indicate failure
        SET @IsRestricted = 1;
    END CATCH;
END;