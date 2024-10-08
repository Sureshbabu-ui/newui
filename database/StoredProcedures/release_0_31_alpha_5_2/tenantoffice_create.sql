CREATE OR ALTER PROCEDURE [dbo].[tenantoffice_create]
    @TenantId VARCHAR(32),
    @Code VARCHAR(8),
    @OfficeName VARCHAR(64),
    @RegionId INT,
    @GeoLocation VARCHAR(32),
    @OfficeTypeId INT,
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
    @Tin VARCHAR(16),
    @CreatedBy INT,
    @IsTenantOfficeCreated INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
    SET XACT_ABORT ON; 
	BEGIN TRANSACTION   
	Declare @LastInsertedId NVARCHAR(10);

	INSERT INTO TenantOffice(TenantId,Code,OfficeName,RegionId,GeoLocation,OfficeTypeId,CreatedBy,CreatedOn) 
    VALUES(@TenantId,@Code,@OfficeName,@RegionId,@GeoLocation,@OfficeTypeId,@CreatedBy,GETUTCDATE())

	SET @LastInsertedId=SCOPE_IDENTITY()

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
		GETUTCDATE())
        SET @LastInsertedId = 'SELECT SCOPE_IDENTITY()'
    IF (@LastInsertedId IS NOT NULL)
        SET @IsTenantOfficeCreated = 1
    ELSE
        SET @IsTenantOfficeCreated = 0
    COMMIT TRANSACTION
END