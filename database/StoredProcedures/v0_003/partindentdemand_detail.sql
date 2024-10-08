CREATE OR ALTER PROCEDURE [dbo].[partindentdemand_detail]
    @Id INT
AS
BEGIN
    DECLARE @TenantOfficeTypeId INT;
    SELECT @TenantOfficeTypeId = Id FROM MasterEntityData WHERE Code = 'TOT_CWHS'
    
    SELECT 
        PID.Id,
        PID.DemandNumber,
        PID.DemandDate,
        PID.PartIndentRequestNumber,
        PID.WorkOrderNumber,
        PID.Remarks,
        PID.PartId,
        PID.Quantity AS DemandQuantity,
        PID.IsCwhAttentionNeeded,
        T.OfficeName AS TenantOfficeName,
        PID.TenantOfficeId,
        PID.StockTypeId,
        MED.[Name] AS UnitOfMeasurement,
        Part.[Description] PartName,
        Part.PartCode,
        Part.HsnCode,
        Part.OemPartNumber,
        Part.Quantity AS PartQuantity,
        PID.Price,
        PID.VendorId,
		VI.VendorTypeId,
        SR.CustomerInfoId,
        PIR.RequestedBy AS RecipientUserId,
        PIR.Id AS PartIndentRequestId,
        UI.FullName AS Recipient,
        PIR.TenantOfficeId AS LocationId,
        UI1.FullName AS CallCreatedBy,
        SR.CreatedOn AS CallCreatedOn,
        (SELECT COUNT(DISTINCT GIN.Id) FROM GoodsIssuedReceivedNote GIN WHERE GIN.PartIndentDemandId = PID.Id) AS GIRNCount,
        (
			SELECT COUNT(DISTINCT PS.Id) 
			FROM PartStock PS
			INNER JOIN TenantOffice T ON T.Id = PS.TenantOfficeId
			INNER JOIN MasterEntityData OT ON OT.Id = T.OfficeTypeId
			LEFT JOIN StockRoom SR ON SR.Id = PS.StockRoomId 
			WHERE PS.PartId = PID.PartId AND PS.TenantOfficeId = PID.TenantOfficeId AND PS.IsPartAvailable = 1 AND 
			SR.RoomCode = 'S006'AND OT.Code = 'TOT_AROF'
		) AS CLPartCount,
        (
			SELECT COUNT(DISTINCT PS.Id) 
			FROM PartStock PS 
			INNER JOIN TenantOffice T ON T.Id = PS.TenantOfficeId
			INNER JOIN MasterEntityData OT ON OT.Id = T.OfficeTypeId
			LEFT JOIN StockRoom SR ON SR.Id = PS.StockRoomId 
			WHERE PS.PartId = PID.PartId AND PS.IsPartAvailable = 1 AND 
			SR.RoomCode = 'S006'AND OT.Code = 'TOT_AROF' AND
			PS.TenantOfficeId != PID.TenantOfficeId 
		) AS OLPartCount,
        (
			SELECT COUNT(DISTINCT PS.Id) 
			FROM PartStock PS 
			LEFT JOIN StockRoom SR ON SR.Id = PS.StockRoomId 
			INNER JOIN TenantOffice T ON T.Id = PS.TenantOfficeId
			WHERE PS.PartId = PID.PartId AND PS.TenantOfficeId != PID.TenantOfficeId AND PS.IsPartAvailable = 1 AND 
			SR.RoomCode = 'S006'AND T.Code = 'CWH'
		) AS CWHPartCount,
        (
            SELECT COUNT(DISTINCT PO.Id)
            FROM PartIndentRequest PIR
                LEFT JOIN PurchaseOrderDetail POD ON POD.PartIndentRequestId = PIR.Id
                LEFT JOIN PurchaseOrder PO ON PO.Id = POD.PurchaseOrderId
            WHERE
                PIR.IndentRequestNumber = PID.PartIndentRequestNumber
                AND POD.PartId = PID.PartId
        ) AS POCount
    FROM 
        PartIndentDemand PID
        LEFT JOIN TenantOffice T ON T.Id = PID.TenantOfficeId
        LEFT JOIN Vendor V ON V.Id = PID.VendorId
        LEFT JOIN VendorInfo VI ON VI.VendorId = V.Id
        LEFT JOIN Part ON Part.Id = PID.PartId
        LEFT JOIN PartIndentRequest PIR ON PIR.IndentRequestNumber = PID.PartIndentRequestNumber
        LEFT JOIN MasterEntityData MED ON MED.Id = PID.UnitOfMeasurementId
        LEFT JOIN UserInfo UI ON UI.Id = PIR.RequestedBy
        LEFT JOIN ServiceRequest SR ON PIR.ServiceRequestId = SR.Id
        LEFT JOIN UserInfo UI1 ON UI1.Id = SR.CreatedBy
    WHERE 
        PID.Id = @Id
    ORDER BY
        PID.Id;
END
