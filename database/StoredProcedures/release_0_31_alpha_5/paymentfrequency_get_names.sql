CREATE OR ALTER PROCEDURE [dbo].[paymentfrequency_get_names]
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id,
		Code,
		[Name],
		CalendarMonths 
	FROM PaymentFrequency 
	WHERE 
		IsActive=1
	ORDER BY [Name] ASC;
END
