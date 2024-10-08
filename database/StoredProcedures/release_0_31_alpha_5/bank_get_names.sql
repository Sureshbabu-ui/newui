CREATE OR ALTER PROCEDURE [dbo].[bank_get_names]
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Query NVARCHAR(MAX);
	SELECT
		Id,
		BankCode,
		BankName
	FROM Bank
	WHERE 
		IsDeleted = 0				
END