CREATE OR ALTER   PROCEDURE [dbo].[invoice_pending_bargraph_detail]
    @RegionId    INT = NULL,
    @StartDate      DATE ,
    @EndDate		DATE
AS
BEGIN 
	SET NOCOUNT ON;
		IF(@RegionId IS NULL)
		WITH InvoiceCounts AS 
			(SELECT
				O.RegionId,
				COUNT(CIS.Id) - COUNT(CI.Id) AS InvoicePending
			FROM ContractInvoiceSchedule CIS
			INNER JOIN Contract C ON CIS.ContractId = C.Id
			INNER JOIN TenantOffice O ON O.Id = C.TenantOfficeId
			LEFT JOIN ContractInvoice CI ON CIS.Id = CI.ContractInvoiceScheduleId
			WHERE CIS.ScheduledInvoiceDate BETWEEN @StartDate AND @EndDate
			GROUP BY O.RegionId)
		
		SELECT
			TR.Code,
			ISNULL(IC.InvoicePending, 0) AS InvoicePending
		FROM TenantRegion TR
		LEFT JOIN InvoiceCounts IC ON IC.RegionId = TR.Id 
		ELSE
		WITH InvoiceCounts AS 
			(SELECT
				TenantOfficeId,
				COUNT(CIS.Id) - COUNT(CI.Id) AS InvoicePending
			FROM ContractInvoiceSchedule CIS
			LEFT JOIN ContractInvoice CI ON CIS.Id = CI.ContractInvoiceScheduleId
			JOIN Contract C ON CIS.ContractId = C.Id
			WHERE CIS.ScheduledInvoiceDate BETWEEN @StartDate AND @EndDate
			GROUP BY TenantOfficeId)
		
		SELECT
			TOF.Code,
			ISNULL(IC.InvoicePending, 0) AS InvoicePending
		FROM TenantOffice TOF
		INNER JOIN MasterEntityData MED ON MED.Id = TOF.OfficeTypeId
		LEFT JOIN InvoiceCounts IC ON IC.TenantOfficeId = TOF.Id
		WHERE 
			(MED.Code = 'TOT_AROF')
			AND TOF.RegionId = @RegionId;
END