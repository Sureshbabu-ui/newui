CREATE OR ALTER   PROCEDURE [dbo].[tenant_update]
	@TenantId INT,
	@TenantInfoId INT,
	@Name VARCHAR(64),
	@NameOnPrint VARCHAR(64),
	@PanNumber VARCHAR(10),
	@Address VARCHAR(128),
	@CWHAddress VARCHAR(128),
	@GRCAddress VARCHAR(128),
	@HOAddress VARCHAR(128),
	@CWHOfficeInfoId INT,
	@HeadOfficeInfoId INT,
	@GRCOfficeInfoId INT,
	@CityId INT,
	@StateId INT,
	@CountryId INT,
	@Pincode VARCHAR(6),
	@UpdatedBy INT
AS 
BEGIN 
	SET NOCOUNT ON;
	SET XACT_ABORT ON;  
	BEGIN TRANSACTION
	DECLARE @CWHOfficeTypeId INT ;
	DECLARE @GRCOfficeTypeId INT;
	DECLARE @HeadOfficeTypeId INT;

	DECLARE @InsertedIds TABLE (TenantOfficeId INT, InsertType VARCHAR(20));
	DECLARE @NewCWHOfficeInfoId INT ;
	DECLARE @NewGRCOfficeInfoId INT;
	DECLARE @NewHeadOfficeInfoId INT;

	SELECT	@CWHOfficeTypeId = Id FROM MasterEntityData WHERE Code ='TOT_CWHS'
	SELECT	@GRCOfficeTypeId = Id FROM MasterEntityData WHERE Code ='TOT_GRCR'
	SELECT	@HeadOfficeTypeId = Id FROM MasterEntityData WHERE Code ='TOT_HDOF'

	IF NOT EXISTS (
        SELECT 1 
        FROM TenantInfo
        WHERE TenantId = @TenantId 
		  AND EffectiveTo IS NULL
          AND Name = @Name
          AND NameOnPrint = @NameOnPrint
          AND Address = @Address
          AND PanNumber = @PanNumber
          AND CountryId = @CountryId
          AND StateId = @StateId
          AND CityId = @CityId
		  AND Pincode = @Pincode
    )
    BEGIN
		INSERT INTO TenantInfo (
			TenantId,
			Name,
			NameOnPrint,
			Address,
			PanNumber,
			IsVerified,
			CountryId,
			StateId,
			CityId,
			Pincode,
			EffectiveFrom,
			CreatedBy,
			CreatedOn
		)
		VALUES (
			@TenantId,
			@Name,
			@NameOnPrint,
			@Address,
			@PanNumber,
			1,
			@CountryId,
			@StateId,
			@CityId,
			@Pincode,
			GETUTCDATE(),
			@UpdatedBy,
			GETUTCDATE()
		);
			UPDATE 
			TenantInfo
		SET 
			EffectiveTo = GETUTCDATE(),
			UpdatedBy = @UpdatedBy,
			UpdatedOn = GETUTCDATE()
		WHERE 
			Id = @TenantInfoId
	END

	INSERT INTO TenantOfficeInfo
    (TenantOfficeId, Address, CityId, StateId, CountryId, Pincode, Phone, Email, Mobile, ManagerId, GstNumber, GstStateId, Tin, IsVerified, EffectiveFrom, CreatedBy, CreatedOn)
	OUTPUT inserted.Id, 'CWHInfoId' INTO @InsertedIds	
	SELECT
		TenantOfficeId,
		@CWHAddress,
		CityId,
		StateId,
		CountryId,
		Pincode,
		Phone,
		Email,
		Mobile,
		ManagerId,
		GstNumber,
		GstStateId,
		Tin,
		IsVerified,
		GETUTCDATE(),
		@UpdatedBy,
		GETUTCDATE()
	FROM
		TenantOfficeInfo
	WHERE
		Id = @CWHOfficeInfoId AND EffectiveTo Is NULL AND Address != @CWHAddress 

	INSERT INTO TenantOfficeInfo
    (TenantOfficeId, Address, CityId, StateId, CountryId, Pincode, Phone, Email, Mobile, ManagerId, GstNumber, GstStateId, Tin, IsVerified, EffectiveFrom, CreatedBy, CreatedOn)
	OUTPUT inserted.Id, 'GRCInfoId' INTO @InsertedIds	
	SELECT
		TenantOfficeId,
		@GRCAddress,
		CityId,
		StateId,
		CountryId,
		Pincode,
		Phone,
		Email,
		Mobile,
		ManagerId,
		GstNumber,
		GstStateId,
		Tin,
		IsVerified,
		GETUTCDATE(),
		@UpdatedBy,
		GETUTCDATE()
	FROM
		TenantOfficeInfo
	WHERE
		Id = @GRCOfficeInfoId AND EffectiveTo Is NULL AND Address != @GRCAddress 

	INSERT INTO TenantOfficeInfo
    (TenantOfficeId, Address, CityId, StateId, CountryId, Pincode, Phone, Email, Mobile, ManagerId, GstNumber, GstStateId, Tin, IsVerified, EffectiveFrom, CreatedBy, CreatedOn)
	OUTPUT inserted.Id, 'HOInfoId' INTO @InsertedIds	
	SELECT
		TenantOfficeId,
		@HOAddress,
		CityId,
		StateId,
		CountryId,
		Pincode,
		Phone,
		Email,
		Mobile,
		ManagerId,
		GstNumber,
		GstStateId,
		Tin,
		IsVerified,
		GETUTCDATE(),
		@UpdatedBy,
		GETUTCDATE()
	FROM
		TenantOfficeInfo
	WHERE
		Id = @HeadOfficeInfoId AND EffectiveTo Is NULL AND Address != @HOAddress

	SELECT @NewCWHOfficeInfoId = TenantOfficeId FROM @InsertedIds WHERE InsertType = 'CWHInfoId';
	SELECT @NewGRCOfficeInfoId = TenantOfficeId FROM @InsertedIds WHERE InsertType = 'GRCInfoId';
	SELECT @NewHeadOfficeInfoId = TenantOfficeId FROM @InsertedIds WHERE InsertType = 'HOInfoId';

	UPDATE TenantOfficeInfo
	SET 
		EffectiveTo = GETUTCDATE(),
		UpdatedBy = @UpdatedBy,
		UpdatedOn = GETUTCDATE()
	WHERE 
		(
			Id = @CWHOfficeInfoId AND @NewCWHOfficeInfoId IS NOT NULL
		)
		OR (
			Id = @GRCOfficeInfoId AND @NewGRCOfficeInfoId IS NOT NULL
		)
		OR (
			Id = @HeadOfficeInfoId AND @NewHeadOfficeInfoId IS NOT NULL
		);

	COMMIT TRANSACTION;
END