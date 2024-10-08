CREATE OR ALTER PROCEDURE [dbo].[purchaseorder_details]
	@PoId INT
AS
BEGIN 
    SELECT 
        POD.Id,
		PO.PoNumber,
		PO.PoDate,
		VI.[Name] AS Vendor,
		T.OfficeName AS TenantOffice,
		BT.OfficeName AS BillToTenantOffice,
		BTO.[Address] AS BillToAddress,
		ST.OfficeName AS ShipToTenantOffice,
		STO.[Address] AS ShipToAddress,
		PIR.IndentRequestNumber,
		MED.[Name] AS PoStatus,
		POD.Quantity,
		POD.GrnReceivedQuantity,
		POD.Price,
		POD.PartName,
		POD.CgstRate,
		POD.IgstRate,
		POD.SgstRate,
		PPT.[Name] AS PoPartType
	FROM PurchaseOrderDetail POD
		LEFT JOIN PurchaseOrder PO ON PO.Id = POD.PurchaseOrderId
		LEFT JOIN MasterEntityData PPT ON PPT.Id = POD.PoPartTypeId
		LEFT JOIN VendorInfo VI ON VI.VendorId = PO.VendorId
		LEFT JOIN TenantOffice T ON T.Id = PO.TenantOfficeId
		LEFT JOIN TenantOfficeInfo TOI ON T.Id = TOI.TenantOfficeId
		LEFT JOIN TenantRegion ON TenantRegion.Id = T.RegionId
		LEFT JOIN TenantOfficeInfo BTO ON PO.BillToTenantOfficeInfoId = BTO.Id
		LEFT JOIN TenantOffice BT ON BT.Id = BTO.TenantOfficeId
		LEFT JOIN TenantOfficeInfo STO ON PO.ShipToTenantOfficeInfoId = STO.Id
		LEFT JOIN TenantOffice ST ON ST.Id = STO.TenantOfficeId
		LEFT JOIN PartIndentRequest PIR ON PIR.Id = POD.PartIndentRequestId
		LEFT JOIN MasterEntityData MED ON MED.Id = PO.PoStatusId
	WHERE
		POD.PurchaseOrderId = @PoId
END