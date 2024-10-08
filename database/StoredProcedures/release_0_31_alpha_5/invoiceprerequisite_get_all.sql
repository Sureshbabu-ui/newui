CREATE OR ALTER PROCEDURE [dbo].[invoiceprerequisite_get_all]
AS                              
BEGIN
	SET NOCOUNT ON;
	SELECT 
		Id,
		DocumentName,
		[Description],
		DocumentCode 
	FROM InvoicePrerequisite
	WHERE 
		IsActive =1
	ORDER BY DocumentName ASC;
END