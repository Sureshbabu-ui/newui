CREATE OR ALTER PROCEDURE [dbo].[make_unique_check]
	@MakeId INT,
    @Name VARCHAR(64),
    @IsNameExist INT OUTPUT
AS
BEGIN 
SET NOCOUNT ON;
    IF (NOT EXISTS (SELECT ID FROM Make WHERE [Name] = @Name AND Id != @MakeId))
        SET @IsNameExist = 0;
    ELSE
        SET @IsNameExist = 1;
END