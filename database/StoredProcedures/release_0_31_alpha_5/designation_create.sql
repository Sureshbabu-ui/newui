CREATE OR ALTER PROCEDURE [dbo].[designation_create] 
    @Code VARCHAR(8),
    @Name VARCHAR(64),
    @CreatedBy INT,
    @IsActive BIT,
    @IsDesignationCreated INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
    INSERT INTO
        Designation
            (Code,
            [Name],
            IsActive,
            CreatedBy,
            CreatedOn)
    VALUES
            (@Code,
            @Name,
            @IsActive,
            @CreatedBy,
            GETUTCDATE())
    SET
            @IsDesignationCreated = 1
END 