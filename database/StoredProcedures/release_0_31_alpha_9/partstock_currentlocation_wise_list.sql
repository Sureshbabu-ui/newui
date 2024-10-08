CREATE OR ALTER PROCEDURE [dbo].[partstock_currentlocation_wise_list]
    @PartIndentDemandId INT,
	@StockTypeId INT = NULL
AS
BEGIN
	SELECT  
        PS.Id AS PartStockId,
        P.PartCode,
        P.[Description] PartName,
        PS.SerialNumber,
        PS.Rate,
        SR.RoomName,
        SB.BinName,
        TOC.OfficeName AS TenantOffice,
        PS.PartWarrantyExpiryDate,
		StockType.[Name] AS StockType,
		PS.CreatedOn,
		DATEDIFF(DAY,PS.CreatedOn, GETUTCDATE()) AS AgingInDays
    FROM PartStock PS
		INNER JOIN PartIndentDemand PID ON PID.PartId = PS.PartId
		LEFT JOIN Part P ON P.Id = PS.PartId
		LEFT JOIN StockRoom SR ON SR.Id = PS.StockRoomId
		LEFT JOIN StockBin SB ON SB.Id = PS.StockBinId
		LEFT JOIN TenantOffice TOC ON TOC.Id = PS.TenantOfficeId
		INNER JOIN MasterEntityData OT ON OT.Id = TOC.OfficeTypeId
		INNER JOIN MasterEntityData StockType ON StockType.Id = PS.StockTypeId
    WHERE PID.Id = @PartIndentDemandId AND 
		PID.TenantOfficeId = PS.TenantOfficeId AND 
		PS.IsPartAvailable = 1 AND 
		SR.RoomCode = 'S006'AND 
		OT.Code = 'TOT_AROF' AND 
		(@StockTypeId IS NULL AND StockType.Code != 'STT_DFCT' OR PS.StockTypeId = @StockTypeId)
	ORDER BY PS.CreatedOn ASC
END