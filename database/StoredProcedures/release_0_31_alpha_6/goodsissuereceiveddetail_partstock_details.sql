CREATE OR ALTER PROCEDURE [dbo].goodsissuereceiveddetail_partstock_details
    @GinId INT
AS
BEGIN
	SELECT 
		MED.[Name] AS StockType,
		Part.HsnCode,
		Part.PartName,
		Part.OemPartNumber,
		Part.PartCode,
		Part.[Description],
		PS.Rate,
		GIRD.IssuedQuantity,
		PS.SerialNumber
	FROM GoodsIssuedReceivedNote GIN
		LEFT JOIN PartIndentDemand PID ON PID.Id = GIN.PartIndentDemandId
		LEFT JOIN GoodsIssuedReceivedDetail GIRD ON GIRD.GoodsIssuedReceivedNoteId = GIN.Id
		LEFT JOIN PartStock PS ON PS.Id = GIRD.PartStockId
		LEFT JOIN Part ON Part.Id = PID.PartId
		LEFT JOIN MasterEntityData MED ON MED.Id = PID.StockTypeId
	WHERE 
		GIN.Id = @GinId 
		AND PID.Id = GIN.PartIndentDemandId
END