CREATE OR ALTER   PROCEDURE [dbo].[vendor_create]
@TenantOfficeId INT,
@IsMsme VARCHAR(8),
@Name VARCHAR(64),
@Address VARCHAR(128),
@CityId INT,
@StateId INT,
@CountryId INT,
@Pincode VARCHAR(6),
@ContactName VARCHAR(32),
@Email VARCHAR(64),
@ContactNumberOneCountryCode VARCHAR(8),
@ContactNumberOne VARCHAR(16),
@ContactNumberTwoCountryCode VARCHAR(8),
@ContactNumberTwo VARCHAR(16),
@CreditPeriodInDays INT,
@GstNumber VARCHAR(16),
@GstVendorTypeId INT,
@ArnNumber VARCHAR(16),
@EsiNumber VARCHAR(17),
@PanNumber VARCHAR(10),
@PanTypeId INT,
@VendorTypeId INT,
@TanNumber VARCHAR(10),
@CinNumber VARCHAR(21),
@MsmeRegistrationNumber VARCHAR(16) = NULL,
@MsmeCommencementDate date = NULL,
@MsmeExpiryDate date = NULL,
@CreatedBy INT
AS
BEGIN
SET NOCOUNT ON;
SET XACT_ABORT ON;  
BEGIN TRANSACTION
	DECLARE @LastInsertedId NVARCHAR(10);
	DECLARE @VendorCode NVARCHAR(32);
	DECLARE @AppValue NVARCHAR(2);

	SELECT @AppValue = AppValue FROM AppSettings WHERE AppKey = 'AppTwoLetterCode'
	EXEC dbo.documentnumberformat_get_nextnumber
		@DocumentTypeCode = 'DCT_VNDR', 
		@AppCode = @AppValue,
		@DocumentNumber = @VendorCode OUTPUT

	INSERT INTO Vendor 
		(VendorCode,
		CreatedBy,
		CreatedOn)
	VALUES
		(@VendorCode,
		@CreatedBy,
		GETUTCDATE())

	SET @LastInsertedId=SCOPE_IDENTITY()

	INSERT INTO VendorInfo
		(VendorId,
		TenantOfficeId,
		Name,
		Address,	
		CityId,
		StateId,				
		CountryId,				
		Pincode,
		ContactName,
		Email,
		ContactNumberOneCountryCode,
		ContactNumberOne,
		ContactNumberTwoCountryCode,
		ContactNumberTwo,
		CreditPeriodInDays,
		GstNumber,
		GstVendorTypeId,
		ArnNumber,
		EsiNumber,
		PanNumber,
		PanTypeId,
		VendorTypeId,
		TanNumber,
		CinNumber,
		IsMsme,
		MsmeRegistrationNumber,
		MsmeCommencementDate,
		MsmeExpiryDate,
		EffectiveFrom,
		CreatedBy,
		CreatedOn)
		VALUES
		(@LastInsertedId,
		@TenantOfficeId,
		@Name,
		@Address,	
		@CityId,
		@StateId,
		@CountryId,
		@Pincode,
		@ContactName,
		@Email,
		@ContactNumberOneCountryCode,
		@ContactNumberOne,
		@ContactNumberTwoCountryCode,
		@ContactNumberTwo,
		@CreditPeriodInDays,
		@GstNumber,
		@GstVendorTypeId,
		@ArnNumber,
		@EsiNumber,
		@PanNumber,
		@PanTypeId,
		@VendorTypeId,
		@TanNumber,
		@CinNumber,
		@IsMsme,
		@MsmeRegistrationNumber,
		@MsmeCommencementDate,
		@MsmeExpiryDate,
		GETUTCDATE(),
		@CreatedBy,
		GETUTCDATE())
COMMIT TRANSACTION
END
