CREATE OR ALTER PROCEDURE [dbo].[role_create] 
    @Name varchar(64),
    @Code VARCHAR(64),
    @CreatedBy INT,
    @IsActive BIT,
    @IsRoleCreated INT OUTPUT 
AS 
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [Role]
            ([Name],
            Code,
            IsActive,
            CreatedBy,
            CreatedOn)
    VALUES
            (@Name,
            @Code,
            @IsActive,
            @CreatedBy,
            GETUTCDATE())
SET
    @IsRoleCreated = 1
END