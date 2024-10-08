CREATE OR ALTER PROCEDURE [dbo].[customer_site_create]
	@CreatedBy INT,
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
	@IsCustomerSiteCreated INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @LastInsertedId NVARCHAR(10);

	INSERT INTO CustomerSite
		(CustomerId,
		SiteName,
		[Address],
		CityId,
		StateId,
		Pincode,
		GeoLocation,
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
		IsDeleted)
VALUES
		(@CustomerId,
		@SiteName,
		@Address,
		@CityId,
		@StateId,
		@Pincode,
		@GeoLocation,
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
		0)
SET
	@LastInsertedId = 'SELECT SCOPE_IDENTITY()' IF (@LastInsertedId IS NOT NULL)
SET
	@IsCustomerSiteCreated = 1
	ELSE
SET
	@IsCustomerSiteCreated = 0
END 
