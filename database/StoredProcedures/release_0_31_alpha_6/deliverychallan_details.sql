CREATE OR ALTER   PROCEDURE [dbo].[deliverychallan_details]
	@DCId INT
AS
BEGIN 
	SET NOCOUNT ON;
	 SELECT 
        DC.Id,
		DC.DcNumber,
		DC.DcDate,
		DC.TrackingId,
		DC.LogisticsReceiptNumber,
		DC.LogisticsReceiptDate,
		MED.[Name] AS DcType,
		MED.Code AS DcTypeCode,
		TM.[Name] AS ModeOfTransport,
		DV.[Name] AS DestinationVendor,
		LV.[Name] AS LogisticsVendor,
		DE.FullName AS DestinationEmployee,
		IE.FullName AS IssuedEmployee,
		DT.OfficeName AS DestinationTenantOffice,
		ST.OfficeName AS SourceTenantOffice,
		DCD.PartIndentDemandNumber
	FROM
        DeliveryChallan DC
		LEFT JOIN DeliveryChallanDetail DCD ON DCD.DeliveryChallanId = DC.Id
		LEFT JOIN MasterEntityData MED ON MED.Id = DC.DcTypeId
		LEFT JOIN TenantOffice ST ON ST.Id = DC.SourceTenantOfficeId
		LEFT JOIN UserInfo IE ON IE.Id = DC.IssuedEmployeeId
		LEFT JOIN TenantOffice DT ON DT.Id = DC.DestinationTenantOfficeId
		LEFT JOIN UserInfo DE ON DE.Id = DC.DestinationEmployeeId
		LEFT JOIN VendorInfo DV ON DV.Id = DC.DestinationVendorId
		LEFT JOIN VendorInfo LV ON LV.Id = DC.LogisticsVendorId
		LEFT JOIN MasterEntityData TM ON TM.Id = DC.ModeOfTransport
	WHERE 
		DC.Id = @DCId
END
