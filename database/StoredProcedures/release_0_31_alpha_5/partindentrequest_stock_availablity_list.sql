CREATE OR ALTER   PROCEDURE [dbo].[partindentrequest_stock_availablity_list]
	@PartIndentRequestId INT
AS
BEGIN
DECLARE @CurrentLocation VARCHAR(32)
	SELECT @CurrentLocation = T.OfficeName FROM PartIndentRequest PIR
		INNER JOIN TenantOffice T ON PIR.TenantOfficeId = T.Id
		INNER JOIN PartIndentRequestDetail PIRD ON PIRD.PartIndentRequestId = PIR.Id
	WHERE
		PIRD.Id = @PartIndentRequestId

	SELECT
		@CurrentLocation As Location,
		COUNT(PS.Id) AS Quantity
	FROM 
		PartStock PS
		INNER JOIN PartIndentRequestDetail PIRD ON PIRD.PartID = PS.PartId
        INNER JOIN PartIndentRequest PIR ON PIR.Id = PIRD.PartIndentRequestId
		INNER JOIN TenantOffice T ON T.Id = PS.TenantOfficeId
		LEFT JOIN StockRoom SR ON SR.Id = PS.StockRoomId 
	WHERE 
		PIRD.Id = @PartIndentRequestId AND PS.IsPartAvailable = 1 AND SR.RoomName = 'S6' AND
		PS.TenantOfficeId = PIR.TenantOfficeId
--OTHERS
	UNION
	SELECT 'Others' AS Location,
		COUNT(PS.Id) AS Quantity
	FROM 
		PartStock PS
		INNER JOIN PartIndentRequestDetail PIRD ON PIRD.PartID = PS.PartId
        INNER JOIN PartIndentRequest PIR ON PIR.Id = PIRD.PartIndentRequestId
		LEFT JOIN StockRoom SR ON SR.Id = PS.StockRoomId 
		INNER JOIN TenantOffice T ON T.Id = PS.TenantOfficeId
		INNER JOIN MasterEntityData OT ON OT.Id = T.OfficeTypeId
WHERE 
		PIRD.Id = @PartIndentRequestId AND PS.IsPartAvailable = 1 AND SR.RoomName = 'S6'
		AND PS.TenantOfficeId != PIR.TenantOfficeId
		AND OT.Code = 'TOT_AROF'
--CWH
	UNION
	SELECT
		'CWH' AS Location,
		COUNT(PS.Id) AS Quantity
	FROM 
		PartStock PS
		INNER JOIN PartIndentRequestDetail PIRD ON PIRD.PartID = PS.PartId
        INNER JOIN PartIndentRequest PIR ON PIR.Id = PIRD.PartIndentRequestId
		LEFT JOIN StockRoom SR ON SR.Id = PS.StockRoomId 
		INNER JOIN TenantOffice T ON T.Id = PS.TenantOfficeId
	WHERE 
		PIRD.Id = @PartIndentRequestId AND PS.IsPartAvailable = 1 AND SR.RoomName = 'S6'
		AND T.Code = 'CWH' 
END