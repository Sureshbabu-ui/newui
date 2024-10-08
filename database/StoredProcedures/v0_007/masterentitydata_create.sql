CREATE OR ALTER PROCEDURE [dbo].[masterentitydata_create]
    @EntityId INT,
    @Code VARCHAR(32),
	@Name VARCHAR(64),
	@IsActive BIT,
	@CreatedBy INT
AS
BEGIN 
    SET NOCOUNT ON;
	INSERT INTO MasterEntityData (
		MasterEntityId,
		Code,
		[Name],
		IsActive,
		CreatedBy,
		CreatedOn
	)
	VALUES (
		@EntityId,
		@Code,
		@Name,
		@IsActive,
		@CreatedBy,
		GETUTCDATE()
	)
END