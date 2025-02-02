﻿CREATE OR ALTER PROCEDURE [dbo].[customer_update] 
	@Id INT,
	@CustomerId INT,
	@Name VARCHAR(64),
	@NameOnPrint VARCHAR(64),
	@CustomerGroupId INT,
	@TenantOfficeId INT,
	@BilledToAddress VARCHAR(128),
    @BilledToCityId INT,
    @BilledToStateId INT,
    @BilledToCountryId INT,
    @BilledToPincode VARCHAR(6),
    @BilledToGstNumber VARCHAR(16),
    @ShippedToAddress VARCHAR(128),
    @ShippedToCityId INT,
    @ShippedToStateId INT,
    @ShippedToCountryId INT,
    @ShippedToPincode VARCHAR(6),
    @ShippedToGstNumber VARCHAR(16),
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
	@UpdatedBy INT
AS
BEGIN 
	BEGIN TRANSACTION 
	SET NOCOUNT ON;
	SET XACT_ABORT ON;
	DECLARE @LastInsertedId NVARCHAR(10);

	UPDATE	
		CustomerInfo
	SET
		EffectiveTo = GETUTCDATE(),
		ModifiedBy = @UpdatedBy,
		ModifiedOn = GETUTCDATE()
	WHERE
		Id = @Id;

	INSERT INTO CustomerInfo (
		CustomerId,
		[Name],
		NameOnPrint,
		CustomerGroupId,
		TenantOfficeId,
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
		IsActive,
		IsDeleted,
		IsVerified,
		CreatedBy,
		CreatedOn)
	VALUES 
		(@CustomerId,
		@Name,
		@NameOnPrint,
		@CustomerGroupId,
		@TenantOfficeId,
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
		1,
		0,
		0,
		@UpdatedBy,
		GETUTCDATE());
COMMIT TRANSACTION 
END