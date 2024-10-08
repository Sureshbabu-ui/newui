CREATE OR ALTER     PROCEDURE [dbo].[userinfo_update] 
    @UserInfoId INT,
    @FullName VARCHAR(64),
    @Email VARCHAR(32),
    @Phone VARCHAR(16),
    @UpdatedBy INT,
    @EngagementTypeId INT,
	@DivisionId INT,
	@DepartmentId INT,
	@DesignationId INT,
	@TenantOfficeId INT,
	@GenderId INT,
	@ReportingManagerId INT,
	@UserCategoryId INT,
    @UserRoleRevoked VARCHAR(MAX),
    @UserRoles VARCHAR(MAX),
	@EngineerCategory INT = NULL,
	@EngineerLevel INT = NULL,
	@EngineerType INT = NULL,
	@EngineerGeolocation VARCHAR(32) = NULL,
	@EngineerAddress VARCHAR(32) = NULL,
	@EngineerCityId INT = NULL,
	@EngineerStateId INT = NULL,
	@EngineerCountryId INT = NULL,
	@EngineerPincode VARCHAR(8) = NULL,
	@BusinessUnits VARCHAR(MAX) = NULL,
	@BusinessUnitsRevoked VARCHAR(MAX) =NULL,
	@IsConcurrentLoginAllowed BIT,
	@DocumentUrl VARCHAR(256),
	@DocumentSize INT,
	@BudgetedAmount VARCHAR(128),
    @EndDate VARCHAR(128),
    @StartDate VARCHAR(128),
    @CustomerAgreedAmount VARCHAR(128),
    @CustomerSiteId INT,
    @ContractId INT,
	@UserGradeId INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    BEGIN TRANSACTION
	DECLARE @EngineerCategoryIsRe INT
	SELECT @EngineerCategoryIsRe =  Id FROM MasterEntityData WHERE Code = 'ETP_RENG'
    UPDATE UserInfo
    SET
        FullName = @FullName,
        Email = @Email,
        Phone = @Phone,
        UserCategoryId = @UserCategoryId,
        EngagementTypeId = @EngagementTypeId,
        DivisionId = @DivisionId,
        DepartmentId = @DepartmentId,
        DesignationId = @DesignationId,
        TenantOfficeId = @TenantOfficeId,
        GenderId = @GenderId,
        ReportingManagerId = @ReportingManagerId,
		DocumentUrl = @DocumentUrl,
		DocumentSize = @DocumentSize,
		UserGradeId = @UserGradeId
    WHERE Id = @UserInfoId;
	-- update user login
	UPDATE UserLogin
	SET
		IsConcurrentLoginAllowed = @IsConcurrentLoginAllowed
	FROM UserLogin
	LEFT JOIN UserInfo ON UserInfo.UserLoginId =UserLogin.Id
	WHERE
		UserInfo.Id = @UserInfoId
 
	-- Update user roles start
	IF(@UserRoleRevoked != '' )
	BEGIN
		DELETE FROM UserRole WHERE UserId = @UserInfoId AND RoleId IN (SELECT [VALUE] FROM STRING_SPLIT(@UserRoleRevoked, ','))
	END
	IF(@UserRoles != '')
	BEGIN
	INSERT INTO UserRole(RoleId, UserId, CreatedOn)
		SELECT 
			VALUE AS RoleId,
			@UserInfoId,
			GETUTCDATE()
		FROM STRING_SPLIT(@UserRoles, ',')
		WHERE NOT EXISTS (
			SELECT 1
			FROM UserRole UR
			WHERE UR.Id = VALUE
			AND UR.UserId = @UserInfoId
		);
	END
	-- update user roles end
 
	-- update business unit starts
	IF (@BusinessUnitsRevoked != '')
	BEGIN
		UPDATE UserBusinessUnit
		SET 
			IsActive = 0,
			UpdatedBy = @UpdatedBy,
			UpdatedOn = GETUTCDATE()
		WHERE 
			UserId = @UserInfoId 
			AND BusinessUnitId IN (SELECT [VALUE] FROM STRING_SPLIT(@BusinessUnitsRevoked, ','));
	END
	IF (@BusinessUnits != '')
	BEGIN
		-- Update existing records
		UPDATE UserBusinessUnit
		SET 
			IsActive = 1,
			UpdatedBy = UpdatedBy,
			UpdatedOn = GETUTCDATE()
		WHERE 
			UserId = @UserInfoId AND IsActive = 0 
			AND BusinessUnitId IN (SELECT VALUE FROM STRING_SPLIT(@BusinessUnits, ','));
 
		-- Insert new records
		INSERT INTO UserBusinessUnit (BusinessUnitId, UserId, UpdatedBy, CreatedOn)
		SELECT 
			VALUE AS BusinessUnitId,
			@UserInfoId AS UserId,
			@UpdatedBy AS UpdatedBy,
			GETUTCDATE() AS CreatedOn
		FROM STRING_SPLIT(@BusinessUnits, ',')
		WHERE NOT EXISTS (
			SELECT 1
			FROM UserBusinessUnit UBU
			WHERE UBU.BusinessUnitId = VALUE
			AND UBU.UserId = @UserInfoId
		);
	END
	-- update business unit end
 
	IF(@EngineerCategory IS NOT NULL)
	BEGIN
	MERGE INTO ServiceEngineerInfo AS EngineerInfo
	USING (VALUES (@UserInfoId)) AS UserInfo (UserInfoId)
	ON EngineerInfo.UserInfoId = UserInfo.UserInfoId
	WHEN MATCHED THEN
		UPDATE SET 
		EngineerLevel = @EngineerLevel,
		EngineerCategory = @EngineerCategory,
		EngineerType = @EngineerType,
		EngineerGeolocation = @EngineerGeolocation,
		[Address] = @EngineerAddress,
		CityId = @EngineerCityId,
		StateId = @EngineerStateId,
		CountryId = @EngineerCountryId,
		Pincode = @EngineerPincode,
		UpdatedBy=@UpdatedBy,
		UpdatedOn = GETUTCDATE()
		WHEN NOT MATCHED THEN
			INSERT (UserInfoId, EngineerLevel, EngineerCategory, EngineerType, EngineerGeolocation, [Address],CityId,StateId,CountryId,Pincode)
			VALUES (@UserInfoId, @EngineerLevel, @EngineerCategory, @EngineerType, @EngineerGeolocation, @EngineerAddress,@EngineerCityId,@EngineerStateId,@EngineerCountryId,@EngineerPincode);
		END
 
		 IF(@EngineerCategory = @EngineerCategoryIsRe )
    BEGIN
        DECLARE @MarginAmount DECIMAL(16, 2);
        DECLARE @ManpowerAllocationStatusId INT;
        SELECT @ManpowerAllocationStatusId = Id FROM MasterEntityData WHERE Code = 'MPR_ACTV'
        -- Convert the varchar amounts to decimal for calculation
        DECLARE @CustomerAgreedAmountDecimal DECIMAL(16, 2);
        DECLARE @BudgetedAmountDecimal DECIMAL(16, 2);
 
        SET @CustomerAgreedAmountDecimal = CAST(@CustomerAgreedAmount AS DECIMAL(16, 2));
        SET @BudgetedAmountDecimal = CAST(@BudgetedAmount AS DECIMAL(16, 2));
        SET @MarginAmount = @CustomerAgreedAmountDecimal - @BudgetedAmountDecimal;
 
        -- insert to ManpowerAllocation table
        UPDATE  ContractManpowerAllocation 
		SET
            BudgetedAmount =  @BudgetedAmount,
            EndDate = @EndDate,
            StartDate = @StartDate,
            CustomerAgreedAmount =  @CustomerAgreedAmount,
            CustomerSiteId = @CustomerSiteId,
            ContractId = @ContractId,
            EmployeeId = @UserInfoId,
            MarginAmount = @MarginAmount,
            AllocationStatusId = @ManpowerAllocationStatusId,
			ModifiedBy = @UpdatedBy,
			ModifiedOn = GETUTCDATE()
		WHERE
		EmployeeId = @UserInfoId
    END
	COMMIT TRANSACTION;
END