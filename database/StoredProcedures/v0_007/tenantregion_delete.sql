CREATE OR ALTER  PROCEDURE [dbo].[tenantregion_delete]
    @Id			INT,
    @DeletedBy	INT,
    @IsDeleted INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
    SET XACT_ABORT ON;
    BEGIN TRY

	BEGIN TRANSACTION
		UPDATE TenantRegion
		SET 
			IsDeleted = 1,
			DeletedBy = @DeletedBy,
			DeletedOn = GETUTCDATE()
		WHERE 
			Id = @Id;
	COMMIT TRANSACTION

	BEGIN TRANSACTION
			DELETE FROM TenantRegion WHERE Id = @Id;
	COMMIT TRANSACTION
	SET @IsDeleted = 1
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