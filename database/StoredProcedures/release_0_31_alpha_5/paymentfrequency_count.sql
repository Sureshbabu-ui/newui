CREATE OR ALTER PROCEDURE [dbo].[paymentfrequency_count]
    @Search  VARCHAR(50)=NULL,
    @TotalRows INT OUTPUT
AS 
BEGIN 
	SET NOCOUNT ON;
	SELECT	
		@TotalRows=COUNT(Id) 
	FROM PaymentFrequency
	WHERE 
		(@Search IS NULL OR 
		[Name] LIKE   '%' + @Search + '%' )
END 
