CREATE OR ALTER PROCEDURE [dbo].[goodsreceivednote_count] 
	@Search VARCHAR(50) = NULL,
	@TotalRows VARCHAR(10) OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
	SELECT 
		@TotalRows = COUNT(GRN.Id)
	FROM GoodsReceivedNote GRN
	WHERE
        (ISNULL(@Search, '') = '' OR GRN.GrnNumber LIKE '%' + @Search + '%')
END