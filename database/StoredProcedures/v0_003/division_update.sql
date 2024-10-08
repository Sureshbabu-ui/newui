CREATE OR ALTER PROCEDURE [dbo].[division_update]
	@Id INT,
	@IsActive BIT,
	@Name VARCHAR(64),
    @UpdatedBy INT
AS
BEGIN 
    SET NOCOUNT ON;

	UPDATE Division 
	SET [Name] = @Name,
	IsActive = @IsActive,
	UpdatedBy = @UpdatedBy,
	UpdatedOn = GETUTCDATE()
	WHERE Id = @Id  
END 