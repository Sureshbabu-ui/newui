CREATE OR ALTER   PROCEDURE [dbo].[contract_update]
	@ContractId INT,
	@AccelLocation INT,
	@CustomerInfoId INT,
	@SalesContactPersonId INT,
	@AgreementTypeId INT,
	@ContractValue DECIMAL(16,2),
	@AmcValue DECIMAL(16,2),
	@FmsValue DECIMAL(16,2),
	@StartDate DATE,
	@EndDate DATE,
	@BookingTypeId INT,
	@BookingDate DATE,
	@BookingValueDate DATE,
	@QuotationReferenceNumber VARCHAR(64),
	@QuotationReferenceDate DATE,
	@PoNumber VARCHAR(64),
	@PoDate DATE,
	@IsPerformanceGuaranteeRequired BIT,
	@PerformanceGuaranteeAmount DECIMAL(16,2),
	@IsMultiSite BIT,
	@IsPreAmcNeeded BIT,
	@SiteCount SMALLINT,
	@PaymentModeId INT,
	@PaymentFrequencyId INT,
	@CreditPeriod INT,
	@ServiceModeId INT,
	@ServiceWindowId INT,
	@IsPmRequired BIT,
	@IsSez BIT,
	@IsBackToBackAllowed BIT,
	@BackToBackScopeId INT,
	@IsStandByFullUnitRequired BIT,
	@IsStandByImprestStockRequired BIT,
	@PmFrequencyId INT, 
	@UpdatedBy INT,
	@ContractInvoicePrerequisite NVARCHAR(MAX)
AS 
BEGIN 
BEGIN TRANSACTION 
	SET NOCOUNT ON;
	SET XACT_ABORT ON; 

	-- Update contract history

	INSERT INTO ContractHistory 
			(ContractId, 
			ContractNumber, 
			CustomerInfoId, 
			TenantOfficeId, 
			AgreementTypeId,
			BookingTypeId, 
			BookingDate, 
			BookingValueDate, 
			ContractValue,
			AmcValue,
			FmsValue,
			QuotationReferenceNumber, 
			QuotationReferenceDate, 
			PoNumber, 
			PoDate, 
			StartDate, 
			EndDate, 
			IsPerformanceGuaranteeRequired,
			PerformanceGuaranteeAmount, 
			IsMultiSite, 
			SiteCount,
			ServiceModeId, 
			PaymentModeId, 
			PaymentFrequencyId, 
			IsPmRequired, 
			IsSez, 
			PmFrequencyId, 
			IsBackToBackAllowed,
			BackToBackScopeId, 
			CreditPeriod, 
			ServiceWindowId, 
			IsStandByFullUnitRequired,
			IsStandByImprestStockRequired, 
			OldContractId, 
			ContractStatusId,
			FirstApproverId, 
			FirstApprovedOn, 
			SecondApproverId, 
			SecondApprovedOn,
			SalesContactPersonId, 
			CallExpiryDate, 
			CallStopDate,
			CallStopReason, 
			CreatedBy, 
			CreatedOn, 
			IsDeleted, 
			DeletedBy, 
			DeletedOn,
			UpdatedBy, 
			UpdatedOn, 
			ReviewComment, 
			IsPreAmcNeeded,
			EffectiveFrom,
			EffectiveTo)
	SELECT
			@ContractId,
			ContractNumber, 
			CustomerInfoId, 
			TenantOfficeId, 
			AgreementTypeId,
			BookingTypeId, 
			BookingDate, 
			BookingValueDate, 
			ContractValue,
			AmcValue,
			FmsValue,
			QuotationReferenceNumber, 
			QuotationReferenceDate, 
			PoNumber, 
			PoDate, 
			StartDate, 
			EndDate, 
			IsPerformanceGuaranteeRequired,
			PerformanceGuaranteeAmount, 
			IsMultiSite, 
			SiteCount,
			ServiceModeId, 
			PaymentModeId, 
			PaymentFrequencyId, 
			IsPmRequired, IsSez, 
			PmFrequencyId, 
			IsBackToBackAllowed,
			BackToBackScopeId, 
			CreditPeriod, 
			ServiceWindowId,
			IsStandByFullUnitRequired,
			IsStandByImprestStockRequired, 
			OldContractId, ContractStatusId,
			FirstApproverId, 
			FirstApprovedOn, 
			SecondApproverId, 
			SecondApprovedOn,
			SalesContactPersonId, 
			CallExpiryDate, 
			CallStopDate,
			CallStopReason, 
			CreatedBy, 
			CreatedOn, 
			IsDeleted, 
			DeletedBy, 
			DeletedOn,
			@UpdatedBy, 
			GETUTCDATE(), 
			ReviewComment, 
			IsPreAmcNeeded,
			CreatedOn,
			GETUTCDATE()
		FROM
			[Contract]
		WHERE
			Id = @ContractId

	-- Update contract details

		UPDATE
			[Contract]
		SET
			TenantOfficeId = @AccelLocation,
			CustomerInfoId = @CustomerInfoId,
			SalesContactPersonId = @SalesContactPersonId,
			AgreementTypeId = @AgreementTypeId,
			ContractValue = @ContractValue,
			AmcValue = @AmcValue,
			FmsValue = @FmsValue,
			StartDate = @StartDate,
			EndDate = @EndDate,
			CallExpiryDate = @EndDate,
			BookingTypeId = @BookingTypeId,
			BookingDate = @BookingDate,
			BookingValueDate = @BookingValueDate,
			QuotationReferenceNumber = @QuotationReferenceNumber,
			QuotationReferenceDate = @QuotationReferenceDate,
			PoNumber = @PoNumber,
			PoDate = @PoDate,
			IsPerformanceGuaranteeRequired = @IsPerformanceGuaranteeRequired,
			PerformanceGuaranteeAmount = @PerformanceGuaranteeAmount,
			IsMultiSite = @IsMultiSite,
			SiteCount = @SiteCount,
			IsPreAmcNeeded = @IsPreAmcNeeded,
			PaymentModeId = @PaymentModeId,
			PaymentFrequencyId = @PaymentFrequencyId,
			CreditPeriod = @CreditPeriod,
			ServiceModeId = @ServiceModeId,
			ServiceWindowId = @ServiceWindowId,
			IsPmRequired = @IsPmRequired,
			IsSez = @IsSez,
			IsBackToBackAllowed = @IsBackToBackAllowed,
			BackToBackScopeId = @BackToBackScopeId,
			IsStandByFullUnitRequired = @IsStandByFullUnitRequired,
			IsStandByImprestStockRequired = @IsStandByImprestStockRequired,
			PmFrequencyId = @PmFrequencyId,
			UpdatedBy = @UpdatedBy,
			UpdatedOn = GETUTCDATE()
		WHERE
			Id = @ContractId;

		--Insert Into ContractInvoicePrerequisite Table from the Json
	MERGE INTO ContractInvoicePrerequisite AS InvoicePrerequisiteTable
	USING (
		SELECT
			Id,
			IsActive,
			InvoicePrerequisiteId,
			DocumentName
		FROM OPENJSON(@ContractInvoicePrerequisite)
		WITH (
			Id INT,
			IsActive BIT,
			InvoicePrerequisiteId INT,
			DocumentName VARCHAR(64)
		)
	) AS InvoicePrerequisiteDetails
	ON InvoicePrerequisiteTable.Id = InvoicePrerequisiteDetails.Id
	WHEN MATCHED THEN
		UPDATE SET
			InvoicePrerequisiteTable.InvoicePrerequisiteId = InvoicePrerequisiteDetails.InvoicePrerequisiteId,
			InvoicePrerequisiteTable.IsActive = InvoicePrerequisiteDetails.IsActive,
			InvoicePrerequisiteTable.DocumentName = InvoicePrerequisiteDetails.DocumentName,
			InvoicePrerequisiteTable.UpdatedBy = @UpdatedBy,
			InvoicePrerequisiteTable.UpdatedOn = GETUTCDATE()
		
	WHEN NOT MATCHED BY TARGET THEN
		INSERT (
			DocumentName,
			InvoicePrerequisiteId,
			IsActive,
			ContractId,
			CreatedBy,
			CreatedOn
		)
		VALUES (
			InvoicePrerequisiteDetails.DocumentName,
			InvoicePrerequisiteDetails.InvoicePrerequisiteId,
			InvoicePrerequisiteDetails.IsActive,
			@ContractId,
			@UpdatedBy,
			GETUTCDATE()
		);
COMMIT TRANSACTION 
END