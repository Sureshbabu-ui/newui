CREATE OR ALTER PROCEDURE [dbo].[goodsreceivednote_details]
    @Id INT,
	@TransactionTypeCode VARCHAR(8) OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;

    SELECT @TransactionTypeCode = TransactionTypeCode 
    FROM GrnTransactionType GTT
        LEFT JOIN GoodsReceivedNote GRN ON GRN.TransactionTypeId = GTT.Id 
    WHERE GRN.Id = @Id;

    IF (@TransactionTypeCode = 'GTT_DCHN')
    BEGIN
        SELECT
            GRN.Id AS GoodsReceivedNoteId,
            GRN.GrnNumber,
            PS.PartId,
            PS.SerialNumber,
            PS.Barcode,
            PS.StockTypeId,
			DCD.PartStockId,
            PS.Rate,
            Part.[Description] PartName,
            Part.HsnCode,
            Part.OemPartNumber,
            Part.PartCode
        FROM GoodsReceivedNote GRN
            LEFT JOIN DeliveryChallanDetail DCD ON DCD.DeliveryChallanId = GRN.TransactionId
            LEFT JOIN PartStock PS ON PS.Id = DCD.PartStockId
            LEFT JOIN Part ON Part.Id = PS.PartId
        WHERE GRN.Id = @Id 
        ORDER BY GRN.Id DESC;
    END
    ELSE IF (@TransactionTypeCode = 'GTT_PORD')
    BEGIN
        SELECT
            GRN.Id AS GoodsReceivedNoteId,
            GRN.GrnNumber,
            POD.PartId,
			POD.Id,
            Part.[Description] PartName,
            Part.HsnCode,
            Part.OemPartNumber,
            Part.PartCode,
            POD.Quantity,
			POD.Price AS Rate,
			POD.PoPartTypeId AS StockTypeId 
        FROM GoodsReceivedNote GRN
            LEFT JOIN PurchaseOrderDetail POD ON POD.PurchaseOrderId = GRN.TransactionId
            LEFT JOIN Part ON Part.Id = POD.PartId
        WHERE GRN.Id = @Id 
        ORDER BY GRN.Id DESC;
    END
	ELSE IF (@TransactionTypeCode = 'GTT_EPRT')
	BEGIN
        SELECT
            GRN.Id AS GoodsReceivedNoteId,
            GRN.GrnNumber,
            PR.PartId,
			(CASE WHEN PR.PartStockId IS NOT NULL THEN PS.SerialNumber ELSE PR.SerialNumber END) AS SerialNumber,
			(CASE WHEN PR.PartStockId IS NOT NULL THEN PS.Barcode ELSE PR.Barcode END) AS Barcode,
			PS.StockTypeId,
            Part.[Description] PartName,
            Part.HsnCode,
            Part.OemPartNumber,
            Part.PartCode,
			PS.Rate
        FROM GoodsReceivedNote GRN
            LEFT JOIN PartReturn PR ON PR.Id = GRN.TransactionId
			LEFT JOIN PartStock PS ON PS.Id = PR.PartStockId
            LEFT JOIN Part ON Part.Id = PR.PartId
        WHERE GRN.Id = @Id 
        ORDER BY GRN.Id DESC;
    END
END