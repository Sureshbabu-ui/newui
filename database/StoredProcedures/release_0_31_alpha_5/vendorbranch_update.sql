CREATE OR ALTER PROCEDURE [dbo].[vendorbranch_update]
	@Id INT,
	@TenantOfficeId INT,
	@IsActive BIT,
	@Code VARCHAR(32),
	@Remarks VARCHAR(128),
	@Name VARCHAR(64),
	@Address VARCHAR(128),
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
	@UpdatedBy INT
AS
BEGIN
SET NOCOUNT ON;
	UPDATE VendorBranch
	SET 
		TenantOfficeId = @TenantOfficeId,
		Code = @Code,
		[Name] = @Name,
		[Address] = @Address,
		CountryId = @CountryId,
		CityId = @CityId,
		StateId = @StateId,
		Pincode = @Pincode,
		ContactName = @ContactName,
		Email = @Email,
		ContactNumberOneCountryCode = @ContactNumberOneCountryCode,
		ContactNumberOne = @ContactNumberOne,
		ContactNumberTwoCountryCode = @ContactNumberTwoCountryCode,
		ContactNumberTwo = @ContactNumberTwo,
		TollfreeNumber = @TollfreeNumber,
		CreditPeriodInDays = @CreditPeriodInDays,
		GstNumber = @GstNumber,
		GstArn = @GstArn,
		GstVendorTypeId = @GstVendorTypeId,
		Remarks	= @Remarks,
		IsActive = @IsActive,
		UpdatedBy = @UpdatedBy,
		UpdatedOn = GETUTCDATE()
	WHERE
		Id = @Id
END