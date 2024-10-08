CREATE OR ALTER   PROCEDURE [dbo].[partindentrequest_stock_availablity_locationwise]
	@PartIndentRequestId INT
AS
BEGIN
	SELECT T.OfficeName AS Location,
		COUNT(PS.Id) AS Quantity
	FROM 
		PartStock PS
		INNER JOIN PartIndentRequestDetail PIRD ON PIRD.PartID = PS.PartId
        INNER JOIN PartIndentRequest PIR ON PIR.Id = PIRD.PartIndentRequestId
		LEFT JOIN StockRoom SR ON SR.Id = PS.StockRoomId 
		INNER JOIN TenantOffice T ON T.Id = PS.TenantOfficeId
		INNER JOIN MasterEntityData OT ON OT.Id = T.OfficeTypeId
	WHERE 
		PIRD.Id = @PartIndentRequestId AND PS.IsPartAvailable = 1 AND 
		SR.RoomName = 'S6' AND PS.TenantOfficeId != PIR.TenantOfficeId
		AND OT.Code = 'TOT_AROF'
	Group By T.OfficeName
END