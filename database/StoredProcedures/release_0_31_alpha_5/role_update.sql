CREATE OR ALTER PROCEDURE [dbo].[role_update]
	@RoleId INT,
	@Name VARCHAR(64),
	@UpdatedBy INT,
	@IsActive BIT,
	@IsRoleUpdated INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
	DECLARE @RoleCount INT;
	DECLARE @StatusChanged INT;
	    IF( 0 = (SELECT Count(Id) FROM UserRole WHERE  (RoleId = @RoleId)))
       		SET @RoleCount = 0;
   		ELSE
       		SET @RoleCount = 1

	    IF( 0 = (SELECT Count(Id) FROM Role WHERE  (Id = @RoleId AND IsActive = @IsActive)))
       		SET @StatusChanged = 1;
   		ELSE
       		SET @StatusChanged = 0;

		IF(@RoleCount = 0)
		BEGIN
			Update Role 
			SET
				Name = @Name,
				IsActive = @IsActive,
				UpdatedBy = @UpdatedBy,
				UpdatedOn = GETUTCDATE()
			WHERE
				Id = @RoleId	
			SET @IsRoleUpdated = 1
		END
		ELSE IF(@RoleCount = 1 AND @StatusChanged = 1)
		BEGIN
			SET @IsRoleUpdated = 0
		END
		ELSE
			BEGIN
			Update Role 
			SET
				Name = @Name,
				UpdatedBy = @UpdatedBy,
				UpdatedOn = GETUTCDATE()
			WHERE
				Id = @RoleId	
			SET @IsRoleUpdated = 1
		END
END