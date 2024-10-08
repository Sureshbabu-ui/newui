﻿CREATE OR ALTER PROCEDURE [dbo].[vendorbranch_create]
	@Code VARCHAR(32),
	@Remarks VARCHAR(128),
	@TenantOfficeId INT,
	@Name VARCHAR(64),
	@Address VARCHAR(128),
	@VendorId INT,
	@CityId INT,
	@CountryId INT,
	@StateId INT,
	@Pincode VARCHAR(6),
	@ContactName VARCHAR(32),
	@Email VARCHAR(64),
	@ContactNumberOneCountryCode VARCHAR(8),
	@ContactNumberOne VARCHAR(16),
	@ContactNumberTwoCountryCode VARCHAR(8),
	@ContactNumberTwo VARCHAR(16),
	@CreditPeriodInDays INT,
	@GstNumber VARCHAR(16),
	@TollfreeNumber VARCHAR(16),
	@GstArn VARCHAR(16),
	@GstVendorTypeId INT,
	@CreatedBy INT
AS
BEGIN
	SET NOCOUNT ON;
	INSERT INTO VendorBranch
		(							
		VendorId,
		TenantOfficeId,
		Code,
		[Name],
		[Address],
		CountryId,
		CityId,
		StateId,				
		Pincode,
		ContactName,
		Email,
		ContactNumberOneCountryCode,
		ContactNumberOne,
		ContactNumberTwoCountryCode,
		ContactNumberTwo,
		TollfreeNumber,
		CreditPeriodInDays,
		GstNumber,
		GstArn,
		GstVendorTypeId,
		Remarks,
		CreatedBy,
		CreatedOn)
	VALUES
		(@VendorId,
		@TenantOfficeId,
		@Code,
		@Name,
		@Address,
		@CountryId,
		@CityId,
		@StateId,				
		@Pincode,
		@ContactName,
		@Email,
		@ContactNumberOneCountryCode,
		@ContactNumberOne,
		@ContactNumberTwoCountryCode,
		@ContactNumberTwo,
		@TollfreeNumber,
		@CreditPeriodInDays,
		@GstNumber,
		@GstArn,
		@GstVendorTypeId,
		@Remarks,
		@CreatedBy,
		GETUTCDATE())
END