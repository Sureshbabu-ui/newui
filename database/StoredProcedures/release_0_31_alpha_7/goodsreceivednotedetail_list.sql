CREATE OR ALTER  PROCEDURE [dbo].[goodsreceivednotedetail_list]
	@GrnId INT,
	@Page INT = 1,
	@PerPage INT = 10,
	@Search VARCHAR(50) = NULL
AS
BEGIN 
	SET NOCOUNT ON;

	IF @Page < 1
	SET @Page = 1;
    SELECT 
		GRND.Id,
		GRND.SerialNumber,
		GRND.Rate,
		P.[Description] PartName,
		P.PartCode,
		P.HsnCode,
		P.OemPartNumber,
		PO.PoNumber
	FROM 
        GoodsReceivedNoteDetail GRND
		LEFT JOIN GoodsReceivedNote GRN ON GRN.Id = GRND.GoodsReceivedNoteId
		LEFT JOIN PurchaseOrder PO ON PO.Id = GRN.TransactionId
		LEFT JOIN PurchaseOrderDetail POD ON POD.Id = PO.Id
		LEFT JOIN Part P ON P.Id = GRND.PartId
	WHERE
        (ISNULL(@Search, '') = '' OR 
		GRND.SerialNumber LIKE '%' + @Search + '%' OR 
		P.[Description] LIKE '%' + @Search + '%' OR
		P.PartCode LIKE '%' + @Search + '%') AND @GrnId = GRND.GoodsReceivedNoteId
    ORDER BY GRN.Id DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END