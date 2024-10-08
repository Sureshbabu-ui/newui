CREATE OR ALTER PROCEDURE [dbo].[goodsissuereceivednote_detail_for_generatepdf]
    @GinId INT
AS
BEGIN
    SELECT 
        GIN.GinDate,
		GIN.GinNumber,
		RB.FullName AS ServiceEngineer,
		PID.WorkOrderNumber,
		MED.[Name] AS StockType,
		Part.HsnCode,
		Part.[Description] PartName,
		Part.OemPartNumber,
		Part.PartCode,
		Part.[Description],
		TOI.[Address] AS TenantOfficeAddress,
		TOI.GstNumber AS TenantGstNumber,
		S.Code TenantStateCode,
		S.[Name] AS TenantState,
		CI.[Name] AS CustomerName,
		CI.BilledToGstNumber,
		CS.PrimaryContactName,
		CS.PrimaryContactPhone,
		CS.SiteName AS CustomerSiteName,
		CS.[Address] AS CustomerSiteAddress,
		CS.Pincode AS CustomerSitePincode,
		CSS.[Name] AS CustomerSiteState,
		C.[Name] AS CustomerSiteCity
    FROM GoodsIssuedReceivedNote GIN
		LEFT JOIN PartIndentDemand PID ON PID.Id = GIN.PartIndentDemandId
	    LEFT JOIN TenantOfficeInfo TOI ON TOI.TenantOfficeId = GIN.TenantOfficeId
		LEFT JOIN [State] AS S ON S.Id = TOI.StateId
		LEFT JOIN PartIndentRequest PIR ON PIR.IndentRequestNumber = PID.PartIndentRequestNumber
		LEFT JOIN UserInfo RB ON RB.Id = PIR.RequestedBy
		LEFT JOIN ServiceRequest SR ON SR.WorkOrderNumber = PID.WorkOrderNumber
		LEFT JOIN CustomerInfo CI ON CI.Id = SR.CustomerInfoId
		LEFT JOIN CustomerSite CS ON CS.Id = SR.CustomerSiteId
		LEFT JOIN [State] CSS ON CSS.Id = CS.StateId
		LEFT JOIN City C ON C.Id = CS.CityId
		LEFT JOIN Part ON Part.Id = PID.PartId
		LEFT JOIN MasterEntityData MED ON MED.Id = PID.StockTypeId
		LEFT JOIN GoodsIssuedReceivedDetail GIRD ON GIRD.GoodsIssuedReceivedNoteId = @GinId
    WHERE 
        GIN.Id = @GinId AND PID.Id = GIN.PartIndentDemandId
END