CREATE OR ALTER   PROCEDURE [dbo].[partstockdetail_list] 
    @Page INT = 1,
    @PerPage INT = 10,
    @Search VARCHAR(50) = NULL,
    @PartId INT = NULL
AS 
BEGIN 
    SET NOCOUNT ON;
    IF @Page < 1
        SET @Page = 1;

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
		(@Search IS NULL OR Ps.SerialNumber LIKE '%' + @Search + '%' OR StockRoom.RoomName LIKE '%' + @Search + '%') AND
		(@PartId IS NULL OR  PS.PartId = @PartId)

    ORDER BY PS.Id DESC OFFSET (@Page -1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY
END