CREATE OR ALTER  PROCEDURE [dbo].[tenantregion_create]
	@Code VARCHAR(8),
	@RegionName VARCHAR(64),
	@TenantId VARCHAR(32),
    @OfficeName VARCHAR(64),
    @GeoLocation VARCHAR(32),
    @Address VARCHAR(128),
    @CityId INT,
    @StateId INT,
    @CountryId INT,
    @Pincode VARCHAR(8),
    @Phone VARCHAR(16),
    @Email VARCHAR(64),
    @Mobile VARCHAR(16),
    @ManagerId INT,
    @GstNumber VARCHAR(16),
    @GstStateId INT,
    @Tin VARCHAR(16) =  NULL,
	@CreatedBy INT,
	@IsTenantRegionCreated INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	SET XACT_ABORT ON; 
	DECLARE @LastInsertedId NVARCHAR(10);
	DECLARE @LastRegionId NVARCHAR(10);
	DECLARE @OfficeTypeId INT;
	SELECT @OfficeTypeId = Id  FROM MasterEntityData WHERE Code = 'TOT_RGOF'

	BEGIN TRANSACTION   

	-- Insert to Tenant office
	INSERT INTO TenantOffice(TenantId,Code,OfficeName,GeoLocation,OfficeTypeId,CreatedBy,CreatedOn) 
    VALUES(@TenantId,@Code,@OfficeName,@GeoLocation,@OfficeTypeId,@CreatedBy,GETUTCDATE())

	SET @LastInsertedId = SCOPE_IDENTITY()
	-- Insert to TenantOfficeInfo
    INSERT INTO 
        TenantOfficeInfo
		(TenantOfficeId, 
        [Address] ,
        CityId ,
        StateId ,
        CountryId, 
        Pincode ,
        Phone, 
        Email ,
        Mobile, 
        ManagerId ,
        GstNumber ,
        GstStateId ,
        Tin,
		EffectiveFrom,
		EffectiveTo,
		CreatedBy,
		CreatedOn)
    VALUES
	    (@LastInsertedId,
	    @Address,
        @CityId,
        @StateId ,
        @CountryId, 
        @Pincode,
        @Phone, 
        @Email,
        @Mobile, 
        @ManagerId,
        @GstNumber ,
        @GstStateId ,
        @Tin,
		GETUTCDATE(),
		NULL	,
		@CreatedBy,
		GETUTCDATE()
		)

   -- Insert to TenantRegion
	INSERT INTO 
		TenantRegion
		(Code,
		RegionName,
		TenantOfficeId,
		CreatedBy,
		CreatedOn)
	VALUES
		(@Code,
		@RegionName,
		@LastInsertedId,
		@CreatedBy,
		GETUTCDATE())
	SET @LastRegionId = SCOPE_IDENTITY()


	UPDATE TenantOffice 
		SET RegionId = @LastRegionId
	WHERE Id = @LastInsertedId

	SET @IsTenantRegionCreated = 1
    COMMIT TRANSACTION
END