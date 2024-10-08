CREATE OR ALTER PROCEDURE [dbo].[partstockdetail_count] 
	@Search VARCHAR(50) = NULL,
	@PartId INT = NULL,
	@TotalRows INT OUTPUT
AS 
BEGIN 
	SET NOCOUNT ON;
	SELECT
		@TotalRows = COUNT(PS.Id)
	FROM PartStock PS
		LEFT JOIN Part P ON P.Id = PS.PartId
		LEFT JOIN StockRoom ON StockRoom.Id = PS.StockRoomId
		LEFT JOIN StockBIN ON StockBin.Id = PS.StockBinId
		LEFT JOIN TenantOffice ON TenantOffice.Id = PS.TenantOfficeId
	 WHERE
		(@Search IS NULL OR Ps.SerialNumber LIKE '%' + @Search + '%' OR StockRoom.RoomName LIKE '%' + @Search + '%') AND
		(@PartId IS NULL OR  PS.PartId = @PartId)
END 
