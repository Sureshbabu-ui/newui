CREATE OR ALTER PROCEDURE [dbo].[product_update_unique_check]
	@ProductId INT,
    @ModelName VARCHAR(64),
    @IsModelNameExist INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
    IF (NOT EXISTS (SELECT ID FROM Product WHERE ModelName = @ModelName AND Id != @ProductId))
        SET @IsModelNameExist = 0;
    ELSE
        SET @IsModelNameExist = 1;
END 