CREATE OR ALTER PROCEDURE [dbo].[partindentdemand_issue_parts]
    @PartIndentDemandId INT
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
		StockType.[Name] AS StockType
    FROM PartStock PS
        INNER JOIN PartIndentDemand PID ON PID.PartId = PS.PartId
        INNER JOIN GoodsIssuedReceivedNote GRN ON GRN.PartIndentDemandId = PID.Id
        LEFT JOIN Part P ON P.Id = PS.PartId
        LEFT JOIN StockRoom SR ON SR.Id = PS.StockRoomId
        LEFT JOIN StockBin SB ON SB.Id = PS.StockBinId
        LEFT JOIN TenantOffice TOC ON TOC.Id = PS.TenantOfficeId
		INNER JOIN MasterEntityData StockType ON StockType.Id = PS.StockTypeId
    WHERE PID.Id = @PartIndentDemandId 
        AND PS.Id IN (SELECT PartStockId FROM GoodsIssuedReceivedDetail WHERE GoodsIssuedReceivedNoteId = GRN.Id)
END
