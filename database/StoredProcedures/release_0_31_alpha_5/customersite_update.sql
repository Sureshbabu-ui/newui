CREATE OR ALTER PROCEDURE [dbo].[customersite_update] 
	@Id INT,
	@CustomerId INT,
	@SiteName VARCHAR(64),
	@Address VARCHAR(128),
	@CityId INT,
	@StateId INT,
	@Pincode INT,
	@GeoLocation VARCHAR(64),
	@TenantOfficeId INT,
	@PrimaryContactName VARCHAR(64),
	@PrimaryContactPhone VARCHAR(16),
	@PrimaryContactEmail VARCHAR(32),
	@SecondaryContactName VARCHAR(64),
	@SecondaryContactPhone VARCHAR(16),
	@SecondaryContactEmail VARCHAR(32),
	@ModifiedBy	INT
AS
BEGIN 
	SET NOCOUNT ON;
	UPDATE CustomerSite
	SET 
		SiteName = @SiteName,
		[Address] = @Address,
		CityId = @CityId,
		StateId = @StateId,
		Pincode = @Pincode,
		GeoLocation = @GeoLocation,
		TenantOfficeId = @TenantOfficeId,
		PrimaryContactName = @PrimaryContactName,
		PrimaryContactPhone = @PrimaryContactPhone,
		PrimaryContactEmail = @PrimaryContactEmail,
		SecondaryContactName = @SecondaryContactName,
		SecondaryContactPhone = @SecondaryContactPhone,
		SecondaryContactEmail = @SecondaryContactEmail,
		ModifiedBy = @ModifiedBy,
		ModifiedOn = GETUTCDATE() 
	WHERE 
		Id = @Id
END