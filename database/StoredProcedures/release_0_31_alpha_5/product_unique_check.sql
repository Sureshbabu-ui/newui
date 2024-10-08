CREATE OR ALTER PROCEDURE [dbo].[product_unique_check]
    @ModelName VARCHAR(64),
    @IsModelNameExist INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
    IF (NOT EXISTS (SELECT ID FROM Product WHERE ModelName = @ModelName))
        SET @IsModelNameExist = 0;
    ELSE
        SET @IsModelNameExist = 1;
END