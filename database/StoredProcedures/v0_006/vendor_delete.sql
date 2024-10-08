CREATE OR ALTER PROCEDURE [dbo].[vendor_delete]
    @Id        INT,
    @DeletedBy INT,
    @IsDeleted INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @VendorId INT;

    BEGIN TRY
        SELECT @VendorId = VendorId FROM VendorInfo WHERE Id = @Id;

        BEGIN TRANSACTION;
        UPDATE Vendor
        SET 
            IsDeleted = 1,
            DeletedBy = @DeletedBy,
            DeletedOn = GETUTCDATE()
        WHERE 
            Id = @VendorId;

        UPDATE VendorInfo
        SET 
            IsActive = 0,
            EffectiveTo = GETUTCDATE()
        WHERE 
            VendorId = @VendorId;

        UPDATE VendorBankAccount
        SET 
            IsActive = 0,
            IsDeleted = 1,
            DeletedBy = @DeletedBy,
            DeletedOn = GETUTCDATE()
        WHERE 
            VendorId = @VendorId;

        UPDATE VendorBranch
        SET 
            IsActive = 0,
            IsDeleted = 1,
            DeletedBy = @DeletedBy,
            DeletedOn = GETUTCDATE()
        WHERE 
            VendorId = @VendorId;
        
        COMMIT TRANSACTION;

        BEGIN TRANSACTION;
		
        DELETE FROM VendorBankAccount WHERE VendorId = @VendorId;
        DELETE FROM VendorBranch WHERE VendorId = @VendorId;
        DELETE FROM VendorInfo WHERE Id = @Id;
        DELETE FROM Vendor WHERE Id = @VendorId;

        COMMIT TRANSACTION;

        SET @IsDeleted = 1;
    END TRY
    BEGIN CATCH
        -- Rollback any active transaction in case of an error
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
    END CATCH;
END;