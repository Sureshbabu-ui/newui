CREATE PROCEDURE [dbo].[customer_code_exist_check]
    @CustomerCode VARCHAR(32) = NULL,
	@CodeExist INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
    IF( 0 = (SELECT Count(Id) FROM Customer WHERE CustomerCode =@CustomerCode))
        SET @CodeExist = 0
    ELSE
        SET @CodeExist = 1
END 
