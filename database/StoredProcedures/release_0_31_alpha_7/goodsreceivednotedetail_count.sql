CREATE OR ALTER PROCEDURE [dbo].[goodsreceivednotedetail_count] 
	@Search VARCHAR(50) = NULL,
	@GrnId INT,
	@TotalRows VARCHAR(10) OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
	SELECT 
		@TotalRows = COUNT(GRND.Id)
	FROM GoodsReceivedNoteDetail GRND
	LEFT JOIN Part P ON P.Id = GRND.PartId
	WHERE
        (ISNULL(@Search, '') = '' OR 
		GRND.SerialNumber LIKE '%' + @Search + '%' OR 
		P.[Description] LIKE '%' + @Search + '%' OR
		P.PartCode LIKE '%' + @Search + '%') AND
		@GrnId = GRND.GoodsReceivedNoteId
END