CREATE OR ALTER   PROCEDURE [dbo].[selected_contract_details] 
    @ContractId INT 
AS 
BEGIN

SET NOCOUNT ON;
SELECT
    C.Id,
    C.CustomerInfoId,
    C.TenantOfficeId AS AccelLocation,
    C.AgreementTypeId,
    C.ContractValue,
	C.AmcValue,
	C.FmsValue,
    C.StartDate,
    C.EndDate,
    C.BookingTypeId,
    C.BookingDate,
    C.BookingValueDate,
    C.SalesContactPersonId,
    C.QuotationReferenceNumber,
    C.QuotationReferenceDate,
    C.PoNumber,
    C.PoDate,
    C.IsMultiSite,
    C.SiteCount,
    C.IsPerformanceGuaranteeRequired,
    C.PerformanceGuaranteeAmount,
    C.PaymentModeId,
    C.PaymentFrequencyId,
    C.IsSez,
    C.CreditPeriod AS CreditPeriod,
    CreditPeriod.[Name] AS CreditPeriodName,
    C.ServiceModeId,
    C.ServiceWindowId,
    C.IsBackToBackAllowed,
    C.BackToBackScopeId,
    C.PmFrequencyId,
    C.IsPmRequired,
    C.IsStandByFullUnitRequired,
    C.IsStandByImprestStockRequired,
    C.SalesContactPersonId,
    C.IsPreAmcNeeded AS IsPAVNeeded,
    C.ContractStatusId,
	ContractStatus.Code AS ContractStatusCode
FROM [Contract] C
    LEFT JOIN MasterEntityData CreditPeriod ON C.CreditPeriod = CreditPeriod.Id
	INNER JOIN MasterEntityData ContractStatus ON C.ContractStatusId = ContractStatus.Id
WHERE
    C.Id = @ContractId
END