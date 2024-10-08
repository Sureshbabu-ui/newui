CREATE OR ALTER   PROCEDURE [dbo].[part_stock_details_for_sme]
   @BarCode NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
	SELECT 
		 T.OfficeName AS TenantOffice,
		 PS.Barcode,
		 PID.DemandNumber,
		 PID.WorkOrderNumber,
		 PID.WarrantyPeriod,
		 CONVERT(VARCHAR(10), PS.PartWarrantyExpiryDate, 120) AS PartWarrantyExpiryDate,
		 PO.PoNumber,
		 CONVERT(VARCHAR(10),  PO.PoDate, 120) AS PoDate,
		 Part.PartCode,
		 ST.[Name] AS PartType,
		 Part.[Description],
		 VI.[Name] AS Vendor,
		 PS.Rate AS PartValue,
		 GRN.GrnNumber,
		 CONVERT(VARCHAR(10),  GRN.GrnDate, 120) AS GrnDate,
		 GRN.ReferenceNumber,
		 CONVERT(VARCHAR(10),  GRN.ReferenceDate, 120) AS ReferenceDate
    FROM PartStock PS
		LEFT JOIN Part ON Part.Id = PS.PartId
		LEFT JOIN MasterEntityData ST ON ST.Id = PS.StockTypeId
		LEFT JOIN GoodsReceivedNoteDetail GRND ON GRND.Id = PS.GrnDetailId
		LEFT JOIN GoodsReceivedNote GRN ON GRN.Id = GRND.GoodsReceivedNoteId
		LEFT JOIN GrnTransactionType GTT ON GTT.Id = GRN.TransactionTypeId
		LEFT JOIN TenantOffice T ON T.Id =  PS.TenantOfficeId
		LEFT JOIN PurchaseOrder PO ON PO.Id = GRN.TransactionId
		LEFT JOIN VendorInfo VI ON VI.VendorId = PO.VendorId
		LEFT JOIN ( SELECT DISTINCT PartIndentRequestId,PurchaseOrderId FROM PurchaseOrderDetail ) POD ON POD.PurchaseOrderId = PO.Id
		LEFT JOIN PartIndentRequest PIR ON PIR.Id = POD.PartIndentRequestId
		LEFT JOIN PartIndentDemand PID ON PID.PartIndentRequestNumber = PIR.IndentRequestNumber AND PID.PartId = PS.PartId
	WHERE 
	PS.Barcode = @BarCode 
END