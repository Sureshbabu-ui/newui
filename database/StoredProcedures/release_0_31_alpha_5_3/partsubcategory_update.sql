CREATE OR ALTER PROCEDURE [dbo].[partsubcategory_update]
	@RoleId INT,
	@Name VARCHAR(64),
	@UpdatedBy INT,
	@IsActive BIT
AS 
BEGIN 
    SET NOCOUNT ON;
	Update PartSubCategory 
	SET
		[Name] = @Name,
		IsActive = @IsActive,
		UpdatedBy = @UpdatedBy,
		UpdatedOn = GETUTCDATE()
	WHERE
		Id = @RoleId	
END