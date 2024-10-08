CREATE OR ALTER PROCEDURE [dbo].[contractinvoiceschedule_detail] 
	@ContractInvoiceScheduleId INT
AS
BEGIN
	SET NOCOUNT ON;
	SELECT
		C.AmcValue,
		C.FmsValue,
		C.ContractValue,
		C.ContractNumber,
		C.StartDate AS ContractStartDate,
		C.EndDate AS ContractEndDate,
		C.PoNumber,
		C.BookingDate,
		C.IsSez,
		AGT.[Name] AS AgreementType,
		DATEADD(DAY,  CAST(CP.[Name] AS INT),CIS.ScheduledInvoiceDate) AS InvoiceDueDate,
		CIS.Id,
		CIS.ScheduledInvoiceDate,
		CIS.StartDate AS InvoiceStartDate,
		CIS.EndDate AS InvoiceEndDate,
		CIS.ScheduleNumber,
		CIS.RrPerDay,
		CIS.TotalRrValue,
		CIS.ScheduledInvoiceAmount,
		TI.PanNumber,
		TI.NameOnPrint+'  ' AS TenantOfficeName,
		TOI.[Address],
		TOI.GstNumber ,
		CustomerInfo.NameOnPrint,
		CustomerInfo.BilledToAddress,
		BC.[Name] AS BilledToCityName,
		SC.[Name] AS ShippedToCityName,
		BCO.[Name] AS BilledToCountryName,
		SCO.[Name] AS ShippedToCountryName,
		BS.[Name] AS BilledToStateName,
		SS.[Name] AS ShippedToStateName,
		CustomerInfo.BilledToPincode,
		CustomerInfo.BilledToGstNumber,
		CustomerInfo.ShippedToAddress,
		CustomerInfo.ShippedToPincode,
		CustomerInfo.ShippedToGstNumber
	FROM ContractInvoiceSchedule CIS
	LEFT JOIN [Contract] C ON C.Id=CIS.ContractId
	LEFT JOIN MasterEntityData AGT ON C.AgreementTypeId = AGT.Id
	LEFT JOIN MasterEntityData CP ON C.CreditPeriod = CP.Id
	LEFT JOIN CustomerInfo ON C.CustomerId=CustomerInfo.CustomerId AND CustomerInfo.EffectiveTo IS NULL
	LEFT JOIN City BC ON BC.Id =CustomerInfo.BilledToCityId
	LEFT JOIN City SC ON SC.Id =CustomerInfo.ShippedToCityId
	LEFT JOIN [State] BS ON BS.Id =CustomerInfo.BilledToStateId
	LEFT JOIN [State] SS ON SS.Id =CustomerInfo.ShippedToStateId
	LEFT JOIN Country BCO ON BCO.Id =CustomerInfo.BilledToCountryId
	LEFT JOIN Country SCO ON SCO.Id =CustomerInfo.ShippedToCountryId
	LEFT JOIN TenantOfficeInfo TOI On TOI.Id=C.TenantOfficeId
	LEFT JOIN TenantOffice TOF ON TOF.Id=TOI.TenantOfficeId
	LEFT JOIN TenantInfo TI ON TI.Id=1
	WHERE
		CIS.Id = @ContractInvoiceScheduleId 
END