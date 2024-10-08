CREATE OR ALTER   PROCEDURE [dbo].[contract_details] 
	@ContractId INT,
	@UserInfoId INT
AS 
BEGIN
	SET NOCOUNT ON;
	DECLARE @UserCategory VARCHAR(64);
	DECLARE @UserOfficeId INT;
	DECLARE @UserRegionId INT;
	SELECT
		@UserCategory = UserCategory.Code,
		@UserOfficeId = TenantOfficeId,
		@UserRegionId = RegionId
	FROM UserInfo
	LEFT JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
	INNER JOIN MasterEntityData AS UserCategory ON UserInfo.UserCategoryId = UserCategory.Id
	WHERE    
		UserInfo.Id = @UserInfoId;

	SELECT
		C.Id,
		C.ContractNumber,
		C.CustomerInfoId,
		C.ContractValue,
		C.AmcValue,
		C.FmsValue,
		C.StartDate,
		C.EndDate,
		C.BookingValueDate,
		C.BookingDate,
		C.QuotationReferenceNumber,
		C.QuotationReferenceDate,
		C.PoNumber,
		C.PoDate,
		C.IsMultiSite,
		C.SiteCount,
		C.IsPreAmcNeeded,
		C.IsPerformanceGuaranteeRequired,
		C.PerformanceGuaranteeAmount,
		C.IsSez,
		C.IsPmRequired AS NeedPm,
		C.IsBackToBackAllowed,
		C.IsStandByFullUnitRequired,
		C.IsStandByImprestStockRequired,
		C.ContractStatusId,
		C.CallExpiryDate,
		C.CallStopDate,
		C.CallStopReason,
		C.IsDeleted,
		C.CreatedOn,
		C.CreatedBy AS CreatedById,
		C.UpdatedOn,
		C.AgreementTypeId,
		C.FirstApprovedOn,
		C.FirstApproverId,
		C.SecondApprovedOn,
		C.SecondApproverId,
		C.ReviewComment,
		TenantOffice.OfficeName AS TenantOfficeName,
		TenantOffice.Id AS TenantOfficeId,
		CustomerInfo.[Name] AS CustomerName,
		CustomerInfo.BilledToAddress,
		SalesContactPerson.FullName AS SalesContactPerson,
		AgreementType.[Name] AS AgreementType,
		AgreementType.Code As AgreementTypeCode,
		BookingType.[Name] AS BookingType,
		ServiceMode.[Name] AS ServiceMode,
		PaymentMode.[Name] AS PaymentMode,
		CreditPeriod.[Name] AS CreditPeriod,
		PaymentFrequency.[Name] AS PaymentFrequency,
		ServiceWindow.[Name] AS ServiceWindow,
		PreventiveMaintenanceFrequency.[Name] AS PmFrequency,
		BackToBackScope.[Name] AS BackToBackScope,
		CreatedBy.FullName AS CreatedBy,
		UpdatedBy.FullName AS UpdatedBy,
		FirstApprover.FullName AS FirstApprover,
		SecondApprover.FullName AS SecondApprover,
		ContractStatus.[Name] AS ContractStatus,
		ContractStatus.Code AS ContractStatusCode,
		RenewedContract.Id AS RenewContractId,
		(STUFF((select distinct ', ' + CIP.DocumentName
			  FROM ContractInvoicePrerequisite AS CIP
			  WHERE 
			  CIP.ContractId = @ContractId
			   for xml path(''), TYPE).value('(./text())[1]', 'NVARCHAR(MAX)'),1,1,'')
		) AS ContractInvoicePrerequisite
	FROM [Contract] C
		LEFT JOIN [Contract] RenewedContract ON RenewedContract.Id=C.OldContractId
		LEFT JOIN CustomerInfo ON C.CustomerInfoId = CustomerInfo.Id
		LEFT JOIN UserInfo SalesContactPerson ON C.SalesContactPersonId = SalesContactPerson.Id
		LEFT JOIN UserInfo CreatedBy ON C.CreatedBy = CreatedBy.Id 
		LEFT JOIN UserInfo UpdatedBy ON C.UpdatedBy = UpdatedBy.Id
		LEFT JOIN UserInfo FirstApprover ON C.FirstApproverId = FirstApprover.Id
		LEFT JOIN UserInfo SecondApprover ON C.SecondApproverId = SecondApprover.Id
		LEFT JOIN TenantOffice ON C.TenantOfficeId = TenantOffice.Id
		LEFT JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
		LEFT JOIN PaymentFrequency ON C.PaymentFrequencyId = PaymentFrequency.Id
		INNER JOIN MasterEntityData AgreementType ON C.AgreementTypeId = AgreementType.Id
		INNER JOIN MasterEntityData BookingType ON C.BookingTypeId = BookingType.Id
		LEFT JOIN MasterEntityData ServiceMode ON C.ServiceModeId = ServiceMode.Id
		LEFT JOIN MasterEntityData  PaymentMode ON C.PaymentModeId = PaymentMode.Id
		LEFT JOIN MasterEntityData ContractStatus ON C.ContractStatusId= ContractStatus.Id
		LEFT JOIN MasterEntityData PreventiveMaintenanceFrequency ON C.PmFrequencyId = PreventiveMaintenanceFrequency.Id
		LEFT JOIN MasterEntityData CreditPeriod ON C.CreditPeriod= CreditPeriod.Id
		LEFT JOIN MasterEntityData ServiceWindow ON C.ServiceWindowId = ServiceWindow.Id
		LEFT JOIN MasterEntityData BackToBackScope ON C.BackToBackScopeId = BackToBackScope.Id
	WHERE
		( @UserCategory = 'UCT_FRHO'OR 
		  (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = C.TenantOfficeId) OR 
		  (@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId)
		) AND
		C.Id = @ContractId
END