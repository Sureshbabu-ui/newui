CREATE OR ALTER PROCEDURE [dbo].[contractinvoice_detail] 
	@ContractInvoiceId INT
AS
BEGIN
	SET NOCOUNT ON;
	SELECT
		C.ContractNumber,
		C.StartDate AS ContractStartDate,
		C.EndDate AS ContractEndDate,
		C.PoNumber,
		C.BookingDate,
		AgreementType.[Name] AS AgreementType,
		I.CollectionDueDate AS InvoiceDueDate,
		I.Id,
		I.InvoiceAmount,
		I.DeductionAmount,
		I.InvoiceNumber,
		I.Sgst,
		I.Cgst,
		I.Igst,
		I.InvoiceDate ScheduledInvoiceDate,
		CIS.StartDate AS InvoiceStartDate,
		CIS.EndDate AS InvoiceEndDate,
		TI.PanNumber,
		TI.NameOnPrint+'  ' AS TenantOfficeName,
		TOI.[Address],
		TOI.GstNumber ,
		S.[Name] As StateName,
		CUI.NameOnPrint,
		CUI.BilledToAddress,
		BC.[Name] As BilledToCityName,
		SC.[Name] As ShippedToCityName,
		BCO.[Name] As BilledToCountryName,
		SCO.[Name] As ShippedToCountryName,
		BS.[Name] As BilledToStateName,
		SS.[Name] As ShippedToStateName,
		CUI.BilledToPincode,
		CUI.BilledToGstNumber,
		CUI.ShippedToAddress,
		CUI.ShippedToPincode,
		CUI.ShippedToGstNumber,
		B.BankName,
		BBI.Ifsc,
		TBA.AccountNumber,
		TBA.Email AS BankEmail,
		CI.InvoicePendingReason,
		SRRR.AckDate,
		SRRR.AckNo
	FROM Invoice I
	LEFT JOIN ContractInvoice CI ON I.Id= CI.InvoiceId
	LEFT JOIN ContractInvoiceSchedule CIS ON CIS.Id=CI.ContractInvoiceScheduleId
	LEFT JOIN [Contract] C ON C.Id=CI.ContractId
	LEFT JOIN MasterEntityData AgreementType ON C.AgreementTypeId = AgreementType.Id
	LEFT JOIN CustomerInfo CUI ON I.CustomerInfoId=CUI.Id
	LEFT JOIN City BC ON BC.Id =CUI.BilledToCityId
	LEFT JOIN City SC ON SC.Id =CUI.ShippedToCityId
	LEFT JOIN [State] BS ON BS.Id =CUI.BilledToStateId
	LEFT JOIN [State] SS ON SS.Id =CUI.ShippedToStateId
	LEFT JOIN Country BCO ON BCO.Id =CUI.BilledToCountryId
	LEFT JOIN Country SCO ON SCO.Id =CUI.ShippedToCountryId
	LEFT JOIN TenantOfficeInfo TOI On TOI.Id=C.TenantOfficeId
	LEFT JOIN [State] S ON S.Id =TOI.StateId
	LEFT JOIN TenantOffice TOF ON TOF.Id=TOI.TenantOfficeId
	LEFT JOIN TenantInfo TI ON TI.Id=1
	LEFT JOIN TenantBankAccount TBA On TI.Id=TBA.TenantId
	INNER JOIN BankBranchInfo BBI ON BBI.Id = TBA.BankBranchInfoId
	INNER JOIN BankBranch BB ON BB.Id=BBI.BranchId
	INNER JOIN Bank B ON B.Id=BB.BankId
	LEFT JOIN SalesRegisterReturnResponse SRRR ON  SRRR.InvoiceNo=I.InvoiceNumber
	WHERE
		CI.Id = @ContractInvoiceId
END