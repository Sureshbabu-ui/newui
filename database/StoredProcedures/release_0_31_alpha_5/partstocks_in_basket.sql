CREATE OR ALTER PROCEDURE [dbo].[partstocks_in_basket] 
    @PartStockBasket NVARCHAR(MAX)
AS 
BEGIN 
    SET NOCOUNT ON;

    SELECT
        PS.Id,
        P.PartCode,
        P.PartName,
        PS.SerialNumber,
        PS.Rate,
        StockRoom.RoomName,
        StockBin.BinName,
        TenantOffice.OfficeName,
        PS.PartWarrantyExpiryDate
    FROM PartStock PS
		LEFT JOIN Part P ON P.Id = PS.PartId
		LEFT JOIN StockRoom ON StockRoom.Id = PS.StockRoomId
		LEFT JOIN StockBIN ON StockBin.Id = PS.StockBinId
		LEFT JOIN TenantOffice ON TenantOffice.Id = PS.TenantOfficeId
    WHERE 
		PS.Id IN (SELECT VALUE FROM STRING_SPLIT(@PartStockBasket, ','))
    ORDER BY PS.CreatedOn DESC 
END 

