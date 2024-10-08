CREATE OR ALTER PROCEDURE [dbo].[division_create]
    @Code VARCHAR(8),    
    @Name VARCHAR(64),
    @CreatedBy INT,
    @IsActive BIT,
    @IsDivisionCreated INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
	INSERT INTO Division
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
    SET @IsDivisionCreated = 1
END 