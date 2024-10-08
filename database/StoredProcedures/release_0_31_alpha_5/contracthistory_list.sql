CREATE OR ALTER PROCEDURE [dbo].[contracthistory_list]
    @ContractId INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT
		CH.Id,
		CH.ContractId,
		CH.ContractNumber,
		CH.BookingDate,
		CH.BookingValueDate,
		CH.QuotationReferenceNumber,
		CH.QuotationReferenceDate,
		CH.PoNumber,
		CH.PoDate,
		CH.ContractValue,
		CH.StartDate,
		CH.EndDate,
		CH.IsMultiSite,
		CH.SiteCount,
		CH.IsPmRequired,
		CH.IsBackToBackAllowed,
		CH.IsSez,
		CH.IsStandByFullUnitRequired,
		CH.IsStandByImprestStockRequired,
		CH.IsPreAmcNeeded,
		CH.IsPerformanceGuaranteeRequired,
		CH.PerformanceGuaranteeAmount,
		CH.CallExpiryDate,
		CH.CallStopDate,
		CH.CallStopReason,
		CH.CreatedOn,
		CH.UpdatedOn,
		CH.EffectiveFrom,
		CH.EffectiveTo,
		CH.CreditPeriod,
		CustomerInfo.[Name] AS CustomerName,
		TOI.[Address] AS AccelLocation,
		AGT.[Name] AS AgreementType,
		BT.[Name] AS BookingType,
		SCP.FullName AS SalesContactPerson,
		SM.[Name] AS ServiceMode,
		PM.[Name] AS PaymentMode,
		SW.[Name] AS ServiceWindow,
		BBS.[Name] AS BackToBackScope,
		PF.[Name] AS PaymentFrequency,
		PMF.[Name] AS PmFrequency,
		CB.FullName AS CreatedBy,
		UB.FullName AS UpdatedBy
	FROM ContractHistory CH
	LEFT JOIN CustomerInfo ON CH.CustomerInfoId = CustomerInfo.Id
	LEFT JOIN UserInfo SCP ON CH.SalesContactPersonId = SCP.Id
	LEFT JOIN UserInfo CB ON CH.CreatedBy = CB.Id
	LEFT JOIN UserInfo UB ON CH.UpdatedBy = UB.Id
	LEFT JOIN PaymentFrequency PF ON CH.PaymentFrequencyId = PF.Id
	LEFT JOIN TenantOfficeInfo TOI ON CH.TenantOfficeId = TOI.Id
	LEFT JOIN MasterEntityData AGT ON CH.AgreementTypeId = AGT.Id
	LEFT JOIN MasterEntityData BT ON CH.BookingTypeId = BT.Id
	LEFT JOIN MasterEntityData SM ON CH.ServiceModeId = SM.Id
	LEFT JOIN MasterEntityData PM ON CH.PaymentModeId = PM.Id
	LEFT JOIN MasterEntityData BBS ON CH.BackToBackScopeId = BBS.Id
	LEFT JOIN MasterEntityData SW ON CH.ServiceWindowId = SW.Id
	LEFT JOIN MasterEntityData PMF ON CH.PmFrequencyId = PMF.Id
	WHERE 
		CH.ContractId = @ContractId
	ORDER BY CH.Id DESC
END 