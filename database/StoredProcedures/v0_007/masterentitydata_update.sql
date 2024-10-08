CREATE OR ALTER PROCEDURE [dbo].[masterentitydata_update]
    @Id INT,
	@Name VARCHAR(64),
	@IsActive BIT,
	@ModifiedBy INT
AS 
BEGIN 
	SET NOCOUNT ON;
	UPDATE MasterEntityData 
	SET 
		[Name] = @Name,
	    IsActive = @IsActive,
		ModifiedBy = @ModifiedBy,
		ModifiedOn = GETUTCDATE() 
	WHERE IsSystemData = 0 AND
		Id = @Id
END
