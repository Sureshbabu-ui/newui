CREATE OR ALTER PROCEDURE [dbo].[customer_create]
	@ApprovalRequestId INT,
	@CustomerId INT = NULL,
	@Name VARCHAR(64),
	@NameOnPrint VARCHAR(64),
	@CustomerGroupId INT,
	@TenantOfficeId INT,
	@CustomerIndustryId INT,
	@BilledToAddress VARCHAR(128),
	@BilledToCityId INT,
	@BilledToStateId INT,
	@BilledToCountryId INT,
	@BilledToPincode VARCHAR(6),
	@GstTypeId INT,
	@BilledToGstNumber VARCHAR(16) = NULL,
	@ShippedToAddress VARCHAR(128),
	@ShippedToCityId INT,
	@ShippedToStateId INT,
	@ShippedToCountryId INT,
	@ShippedToPincode VARCHAR(6),
	@ShippedToGstNumber VARCHAR(16) = NULL,
	@IsContractCustomer BIT,
	@PrimaryContactName VARCHAR(64),
	@PrimaryContactEmail VARCHAR(32),
	@PrimaryContactPhone VARCHAR(16),
	@SecondaryContactName VARCHAR(64),
	@SecondaryContactEmail VARCHAR(32),
	@SecondaryContactPhone VARCHAR(16),
	@PanNumber VARCHAR(10),
	@TinNumber VARCHAR(11),
	@TanNumber VARCHAR(10),
	@CinNumber VARCHAR(21),
	@IsMsme BIT,
	@MsmeRegistrationNumber VARCHAR(12) = NULL,
	@ReviewStatus VARCHAR(8),
	@CreatedBy INT
AS
BEGIN 
    SET NOCOUNT ON;
    SET XACT_ABORT ON; 
	DECLARE @AppValue VARCHAR(2);
	DECLARE @TenantOfficeCode VARCHAR(32);
	DECLARE @AppCode VARCHAR(2);
    BEGIN TRANSACTION

	DECLARE @CustomerCode VARCHAR(32)
	EXEC dbo.documentnumberformat_get_nextnumber
		@DocumentTypeCode = 'DCT_CUST', 
		@DocumentNumber = @CustomerCode OUTPUT

	-- Insert to Customer
	INSERT INTO Customer (CustomerCode, CreatedBy, CreatedOn)
	VALUES(@CustomerCode,@CreatedBy,GETUTCDATE())

	SET @CustomerId = SCOPE_IDENTITY()

	-- Insert to CustomerInfo
	INSERT INTO CustomerInfo (
			CustomerId,
			[Name],
			NameOnPrint,
			CustomerGroupId,
			TenantOfficeId,
			CustomerIndustryId,
			PrimaryContactName,
            PrimaryContactEmail,
            PrimaryContactPhone,
            SecondaryContactName,
            SecondaryContactEmail,
            SecondaryContactPhone,
			PanNumber,
			TinNumber,
			TanNumber,
			CinNumber,
			BilledToAddress,
			BilledToCityId,
			BilledToStateId,
			BilledToCountryId,
			BilledToPincode,
			GstTypeId,
			BilledToGstNumber,
			ShippedToAddress,
			ShippedToCityId,
			ShippedToStateId,
			ShippedToCountryId,
			ShippedToPincode,
			ShippedToGstNumber,
			IsMsme,
			MsmeRegistrationNumber,
			IsContractCustomer,
			EffectiveFrom,
			CreatedBy,
			CreatedOn
		)
		VALUES (
			@CustomerId,
			@Name,
			@NameOnPrint,
			@CustomerGroupId,
			@TenantOfficeId,
			@CustomerIndustryId,
			@PrimaryContactName,
            @PrimaryContactEmail,
            @PrimaryContactPhone,
            @SecondaryContactName,
            @SecondaryContactEmail,
            @SecondaryContactPhone,
			@PanNumber,
			@TinNumber,
			@TanNumber,
			@CinNumber,
			@BilledToAddress,
			@BilledToCityId,
			@BilledToStateId,
			@BilledToCountryId,
			@BilledToPincode,
			@GstTypeId,
			@BilledToGstNumber,
			@ShippedToAddress,
			@ShippedToCityId,
			@ShippedToStateId,
			@ShippedToCountryId,
			@ShippedToPincode,
			@ShippedToGstNumber,
			@IsMsme,
			@MsmeRegistrationNumber,
			@IsContractCustomer,
			GETUTCDATE(),
			@CreatedBy,
			GETUTCDATE()
		)
	
	-- Update ApprovalRequest
	IF (@ApprovalRequestId IS NOT NULL)
	BEGIN
		UPDATE ApprovalRequest
		SET IsCompleted = 1
		WHERE Id= @ApprovalRequestId
	END

	DECLARE @SiteName VARCHAR(32);
	SELECT @SiteName = City.Name FROM City WHERE City.Id = @ShippedToCityId

	BEGIN
	-- Insert to CustomerSite
	INSERT INTO
	CustomerSite(
		CustomerId,
		SiteName,
		[Address],
		CityId,
		StateId,
		Pincode,
		TenantOfficeId,
		PrimaryContactName,
		PrimaryContactPhone,
		PrimaryContactEmail,
		SecondaryContactName,
		SecondaryContactPhone,
		SecondaryContactEmail,
		CreatedBy,
		CreatedOn,
		IsActive,
		IsDeleted
	)
    VALUES
	(
		@CustomerId,
		@SiteName,
		@ShippedToAddress,
		@ShippedToCityId,
		@ShippedToStateId,
		@ShippedToPincode,
		@TenantOfficeId,
		@PrimaryContactName,
		@PrimaryContactPhone,
		@PrimaryContactEmail,
		@SecondaryContactName,
		@SecondaryContactPhone,
		@SecondaryContactEmail,
		@CreatedBy,
		GETUTCDATE(),
		1,
		0
	)
    END
COMMIT TRANSACTION   
END