CREATE OR ALTER PROCEDURE [dbo].[partindentrequestdetail_accepted_stocks]
	@ServiceRequestId INT
AS
BEGIN
	SELECT
		P.Id,
        P.[Description] PartName,
		PartStock.SerialNumber,
		GIRD.PartStockId
	FROM 
        PartIndentRequestDetail PIRD
		INNER JOIN PartIndentRequest PIR ON PIR.Id=PIRD.PartIndentRequestId
		INNER JOIN Part P ON P.Id=PIRD.PartId
		LEFT JOIN PartIndentDemand PID ON PID.PartIndentRequestDetailId = PIRD.Id
		LEFT JOIN GoodsIssuedReceivedNote GIRN ON GIRN.PartIndentDemandId= PID.Id 
		LEFT JOIN GoodsIssuedReceivedDetail GIRD ON GIRD.GoodsIssuedReceivedNoteId=GIRN.Id
		LEFT JOIN PartStock ON PartStock.Id=GIRD.PartStockId
		LEFT JOIN PartInstallation ON PartInstallation.PartStockId =PartStock.Id AND PartInstallation.ServiceRequestId=PIR.ServiceRequestId
		LEFT JOIN PartReturn ON PartReturn.PartStockId =PartStock.Id AND PartReturn.ServiceRequestId=PIR.ServiceRequestId
	WHERE PIR.ServiceRequestId= @ServiceRequestId	AND
	GIRN.GinNumber IS NOT NULL 	AND
	PartInstallation.Id IS NULL AND
	PartReturn.Id IS NULL
END