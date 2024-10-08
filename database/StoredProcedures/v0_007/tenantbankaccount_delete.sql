CREATE OR ALTER PROCEDURE [dbo].[tenantbankaccount_delete]
    @Id			int,
    @DeletedBy	int
AS
BEGIN 
SET NOCOUNT ON;
 BEGIN TRY
    BEGIN TRANSACTION;
    UPDATE TenantBankAccount
    SET 
        IsActive = 0,
        IsDeleted = 1,
        DeletedBy = @DeletedBy,
        DeletedOn = GETUTCDATE()
    WHERE 
        Id = @Id;
    COMMIT TRANSACTION;

    BEGIN TRANSACTION;
    
    DELETE FROM TenantBankAccount WHERE Id = @Id;
    
    COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback any active transaction in case of an error
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
    END CATCH;
END