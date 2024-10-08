CREATE OR ALTER  PROCEDURE [dbo].[tenantoffice_delete]
    @Id			INT,
    @DeletedBy	INT,
    @IsDeleted INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
    DECLARE @TenantOfficeId INT
    BEGIN TRY
	BEGIN TRANSACTION
			SELECT @TenantOfficeId = TenantOfficeId FROM TenantOfficeInfo WHERE Id = @Id			
		UPDATE TenantOffice
		SET 
			IsDeleted = 1,
			DeletedBy = @DeletedBy,
			DeletedOn = GETUTCDATE()
		WHERE 
			Id = @TenantOfficeId;

			DELETE FROM TenantOfficeInfo WHERE TenantOfficeId = @TenantOfficeId;
			DELETE FROM TenantOffice WHERE Id = @TenantOfficeId;
			SET @IsDeleted = 1
	COMMIT TRANSACTION
    END TRY
    BEGIN CATCH
	IF @@TRANCOUNT > 0
    ROLLBACK TRANSACTION
		IF ERROR_NUMBER() = 547
		BEGIN
			SET @IsDeleted = 0
		END
    END CATCH;
END