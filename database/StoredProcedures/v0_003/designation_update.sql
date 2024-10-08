CREATE OR ALTER PROCEDURE [dbo].[designation_update]
	@Id INT,
    @Name VARCHAR(64),
	@IsActive VARCHAR(8),
    @UpdatedBy INT
AS
BEGIN 
    SET NOCOUNT ON;
	UPDATE Designation
    SET [Name] = @Name,
		IsActive = @IsActive,
		UpdatedBy = @UpdatedBy,
		UpdatedOn = GETUTCDATE()
	WHERE Id = @Id
END