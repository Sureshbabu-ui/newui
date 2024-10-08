﻿CREATE OR ALTER PROCEDURE [dbo].[tenantregion_update] 
	@TenantRegionId INT,
    @Code VARCHAR(8),
    @RegionName VARCHAR(64),
	@TenantOfficeId INT,
	@TenantOfficeInfoId INT,
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
    @Tin VARCHAR(16)  =  NULL,   
	@IsActive BIT,
    @UpdatedBy INT
AS
BEGIN 
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
	BEGIN TRANSACTION   

    INSERT INTO 
        TenantOfficeInfo
		(
		TenantOfficeId, 
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
		CreatedBy,
		CreatedOn)
    VALUES
	    (@TenantOfficeId,
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
		@UpdatedBy,
		GETUTCDATE())

	UPDATE TenantOfficeInfo
	SET 
		EffectiveTo = GETUTCDATE(),
		UpdatedBy = @UpdatedBy,
		UpdatedOn = GETUTCDATE()
	WHERE 
		Id = @TenantOfficeInfoId;

	UPDATE	TenantRegion
    SET
		IsActive = @IsActive,
        UpdatedBy = @UpdatedBy,
        UpdatedOn = GETUTCDATE()
    WHERE
        Id = @TenantRegionId;
    COMMIT TRANSACTION
END