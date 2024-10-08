CREATE OR ALTER PROCEDURE [dbo].[contract_renew] 
	@ContractId INT,
	@AccelLocation INT,
	@CustomerInfoId INT,
	@SalesContactPersonId INT,
	@AgreementTypeId INT,
	@ContractValue DECIMAL(16, 2),
	@AmcValue DECIMAL(16, 2),
	@FmsValue DECIMAL(16, 2),
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
	@PerformanceGuaranteeAmount INT,
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
	@CreatedBy INT,
	@ContractInvoicePrerequisite NVARCHAR(MAX) 
AS
BEGIN 
	BEGIN TRANSACTION
	SET NOCOUNT ON;
	SET XACT_ABORT ON;

	DECLARE @OldContractId INT = @contractId;
	DECLARE @MasterEntityDataId INT;
	SELECT @MasterEntityDataId = Id FROM MasterEntityData WHERE Code = 'CTS_PGRS'
	INSERT INTO
		[Contract] (
			CustomerInfoId,
			CustomerId,
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
			SalesContactPersonId,
			CallExpiryDate,
			CreatedBy,
			CreatedOn,
			IsPreAmcNeeded
		)
	VALUES
		(
			@CustomerInfoId,
			(SELECT CustomerId FROM CustomerInfo WHERE Id = @CustomerInfoId),
			@AccelLocation,
			@AgreementTypeId,
			@BookingTypeId,
			@BookingDate,
			@BookingValueDate,
			@ContractValue,
			@AmcValue,
			@FmsValue,
			@QuotationReferenceNumber,
			@QuotationReferenceDate,
			@PoNumber,
			@PoDate,
			@StartDate,
			@EndDate,
			@IsPerformanceGuaranteeRequired,
			@PerformanceGuaranteeAmount,
			@IsMultiSite,
			@SiteCount,
			@ServiceModeId,
			@PaymentModeId,
			@PaymentFrequencyId,
			@IsPmRequired,
			@IsSez,
			@PmFrequencyId,
			@IsBackToBackAllowed,
			@BackToBackScopeId,
			@CreditPeriod,
			@ServiceWindowId,
			@IsStandByFullUnitRequired,
			@IsStandByImprestStockRequired,
			@OldContractId,
			@MasterEntityDataId,
			@SalesContactPersonId,
			@EndDate,
			@CreatedBy,
			GETUTCDATE(),
			@IsPreAmcNeeded
		)

	SET @ContractId = SCOPE_IDENTITY() 
	 --Insert Into ContractInvoicePrerequisite Table from the Json
	INSERT INTO
		ContractInvoicePrerequisite (
			InvoicePrerequisiteId,
			DocumentName,
			[Description],
			ContractId,
			CreatedBy,
			CreatedOn
		)
	SELECT
		InvoicePrerequisiteId,
		DocumentName,
		[Description],
		@ContractId,
		@CreatedBy,
		GETUTCDATE()
	FROM
		OPENJSON(@ContractInvoicePrerequisite) WITH(
			InvoicePrerequisiteId INT,
			DocumentName VARCHAR(64),
			[Description] VARCHAR(128)
		);

	INSERT INTO
		ContractCustomerSite (
			ContractId,
			CustomerSiteId,
			CreatedBy,
			CreatedOn
		)
	SELECT
		@contractId,
		CustomerSiteId,
		@CreatedBy,
		GETUTCDATE()
	FROM
		ContractCustomerSite
	WHERE
		ContractCustomerSite.ContractId = @OldContractId
		AND ContractCustomerSite.IsDeleted != 1 

	IF ((SELECT TOP 1 Code FROM MasterEntityData AS AgreementType  WHERE AgreementType.Id = @AgreementTypeId) IN ('AGT_AMCO', 'AGT_NAMC', 'AGT_AFMS', 'AGT_NFMS'))
	BEGIN
	INSERT INTO
		ContractAssetSummary (
			ContractId,
			AssetProductCategoryId,
			ProductCountAtBooking,
			ProductCount,
			AmcRate,
			AmcValue,
			CreatedBy,
			CreatedOn
		)
	SELECT
		@ContractId,
		AssetProductCategoryId,
		ProductCountAtBooking,
		ProductCount,
		AmcRate,
		AmcValue,
		@CreatedBy,
		GETUTCDATE()
	FROM
		ContractAssetSummary AS CAS
	WHERE
		CAS.ContractId = @OldContractId
		AND CAS.IsDeleted != 1
	END

	IF ((SELECT TOP 1 Code FROM MasterEntityData AS AgreementType  WHERE AgreementType.Id = @AgreementTypeId) IN ('AGT_FMSO', 'AGT_AFMS', 'AGT_NFMS'))
	BEGIN
	INSERT INTO
		ContractManPower(
			ContractId,
			CustomerSiteId,
			TenantOfficeInfoId,
			EngineerTypeId,
			EngineerLevelId,
			EngineerMonthlyCost,
			EngineerCount,
			DurationInMonth,
			CustomerAgreedAmount,
			BudgetedAmount,
			MarginAmount,
			CreatedBy,
			CreatedOn,
			Remarks
		)
	SELECT
		@ContractId,
		CustomerSiteId,
		TenantOfficeInfoId,
		EngineerTypeId,
		EngineerLevelId,
		EngineerMonthlyCost,
		EngineerCount,
		DurationInMonth,
		CustomerAgreedAmount,
		BudgetedAmount,
		MarginAmount,
		@CreatedBy,
		GETUTCDATE(),
		Remarks
	FROM
		ContractManPower
	WHERE
		ContractId = @OldContractId
		AND ContractManpower.IsDeleted != 1
END 
COMMIT TRANSACTION
END
