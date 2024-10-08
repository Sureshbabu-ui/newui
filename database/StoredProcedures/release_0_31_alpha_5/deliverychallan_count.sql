CREATE OR ALTER PROCEDURE [dbo].[deliverychallan_count] 
	@Search VARCHAR(50) = NULL,
	@TotalRows VARCHAR(10) OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
	SELECT 
		@TotalRows = COUNT(DC.Id)
	FROM DeliveryChallan DC
	WHERE
		(ISNULL(@Search, '') = '' OR DC.DcNumber LIKE '%' + @Search + '%')
END