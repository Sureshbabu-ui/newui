CREATE OR ALTER  PROCEDURE [dbo].[contract_bookingdetails_report_download]
    @DateFrom DATE = NULL,
    @DateTo DATE = NULL,
    @ContractTypeId INT = NULL,
    @AccelRegionId INT = NULL,
    @AccelLocationId INT = NULL,
    @CustomerId INT = NULL,
	@ContractStatusId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @DateTo IS NULL
        SET @DateTo = GETUTCDATE();

    SELECT 
          C.ContractNumber,
          CI.[Name] AS CustomerName,
		  CI.BilledToAddress ,
		  City.Name AS BilledToCity ,
		  State.Name AS BilledToState,
		  CI.BilledToPincode,
          T.OfficeName,
          AGT.Name AS AgreementType,
          BT.Name AS BookingType,
          C.BookingDate,
          C.ContractValue,
          C.AmcValue,
          C.FmsValue,
          C.QuotationReferenceNumber,
          C.QuotationReferenceDate,
          C.PoNumber,
          C.PoDate,
          C.StartDate,
          C.EndDate,
		  (CASE WHEN C.IsPerformanceGuaranteeRequired = 0 THEN 'No' ELSE 'Yes' END) AS PerformanceGuaranteeRequired, 
          C.PerformanceGuaranteeAmount,
		  (CASE WHEN  C.IsMultiSite = 0 THEN 'No' ELSE 'Yes' END) AS IsMultiSite, 
          C.SiteCount,
		  (CASE WHEN   C.IsPreAmcNeeded = 0 THEN 'No' ELSE 'Yes' END)AS IsPreAmcNeeded, 
          SM.NAME AS ServiceMode,
		  CONCAT (PM.Name,PF.Name) AS PaymentType,
		  (CASE WHEN   C.IsPmRequired = 0 THEN 'No' ELSE 'Yes' END) AS IsPmRequired, 
		  (CASE WHEN   C.IsSez = 0 THEN 'No' ELSE 'Yes' END) AS IsSez, 
          C.CreditPeriod,
          SW.Name AS ServiceWindow,
		  (CASE WHEN   C.IsStandByFullUnitRequired = 0 THEN 'No' ELSE 'Yes' END) AS IsStandByFullUnitRequired, 
          (CASE WHEN   C.IsStandByImprestStockRequired = 0 THEN 'No' ELSE 'Yes' END) AS IsStandByImprestStockRequired, 
          CS.Name AS ContractStatus,
          C.ReviewComment,
          SCP.FullName AS SalesContactPerson,
		  SCP.Email AS SalesContactPersonEmail,
		  SCP.Phone  AS SalesContactPersonPhone,
          C.CallExpiryDate,
          C.CallStopDate,
          C.CallStopReason,
          C.ClosureNote
    FROM Contract C
	LEFT JOIN TenantOffice T ON T.Id = C.TenantOfficeId
	LEFT JOIN CustomerInfo CI ON CI.Id = C.CustomerInfoId
	LEFT JOIN City  ON City.Id = CI.BilledToCityId
	LEFT JOIN State  ON State.Id = CI.BilledToStateId
	LEFT JOIN MasterEntityData  AGT ON AGT.Id = C.AgreementTypeId
	LEFT JOIN MasterEntityData  BT ON BT.Id = C.BookingTypeId
	LEFT JOIN MasterEntityData  PM ON PM.Id = C.PaymentModeId
	LEFT JOIN PaymentFrequency PF ON PF.ID = C.PaymentFrequencyId
	LEFT JOIN MasterEntityData  SW ON SW.Id = C.ServiceWindowId
	LEFT JOIN MasterEntityData  CS ON CS.Id = C.ContractStatusId
	LEFT JOIN UserInfo SCP ON SCP.Id = C.SalesContactPersonId
    LEFT JOIN MasterEntityData  SM ON SM.Id = C.ServiceModeId


    WHERE (@DateFrom IS NULL OR [BookingDate] >= @DateFrom)
          AND [BookingDate] <= @DateTo
          AND (@ContractTypeId IS NULL OR [AgreementTypeId] = @ContractTypeId)
          AND (@AccelRegionId IS NULL OR T.RegionId = @AccelRegionId)
          AND (@AccelLocationId IS NULL OR C.TenantOfficeId = @AccelLocationId)
          AND (@CustomerId IS NULL OR C.CustomerId = @CustomerId)
		  AND (@ContractStatusId IS NULL OR C.ContractStatusId = @ContractStatusId)
		  AND C.IsDeleted = 0;
END;