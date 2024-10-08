CREATE OR ALTER   PROCEDURE [dbo].[userinfo_create]
    @ApprovalRequestId INT =NULL,
    @FullName VARCHAR(64),
    @Email VARCHAR(32),
    @Phone VARCHAR(16),
    @Passcode CHAR(500),
    @CreatedBy INT,
    @EngagementTypeId INT,
    @EmployeeCode VARCHAR(8),
    @DivisionId INT,
    @DepartmentId INT,
    @DesignationId INT,
    @TenantOfficeId INT,
    @GenderId INT,
    @ReportingManagerId INT,
    @UserCategoryId INT,
    @EngineerCategory INT = NULL,
    @EngineerLevel INT = NULL,
    @EngineerType INT = NULL,
    @EngineerGeolocation VARCHAR(32) = NULL,
    @EngineerAddress VARCHAR(32) = NULL,
    @EngineerCityId INT = NULL,
    @EngineerStateId INT = NULL,
    @EngineerCountryId INT = NULL,
    @EngineerPincode VARCHAR(8) = NULL,
    @UserRoles VARCHAR(128),
    @BusinessUnits VARCHAR(MAX),
    @ApprovedBy INT,
    @UserExpiryDate DATE,
    @IsConcurrentLoginAllowed BIT,
    @BudgetedAmount VARCHAR(128),
    @EndDate VARCHAR(128),
    @StartDate VARCHAR(128),
    @CustomerAgreedAmount VARCHAR(128),
    @CustomerSiteId INT,
    @ContractId INT,
    @DocumentUrl VARCHAR(256),
    @DocumentSize INT,
	@UserGradeId INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @start INT = 1;
    DECLARE @length INT = 0;
    DECLARE @RoleId INT;
    DECLARE @LoginId INT;
    DECLARE @UserId INT;
    DECLARE @ReviewStatusId INT;
	DECLARE @EngineerCategoryIsRe INT
	SELECT @EngineerCategoryIsRe =  Id FROM MasterEntityData WHERE Code = 'ETP_RENG'
    BEGIN TRANSACTION

    -- insert to UserLogin table
    INSERT INTO UserLogin (
        Username,
        Passcode,
        CreatedOn,
        CreatedBy,
        IsConcurrentLoginAllowed,
        IsActive
    ) 
    VALUES(
    @EmployeeCode,
    @Passcode,
    GETUTCDATE(),
    @CreatedBy,
    @IsConcurrentLoginAllowed,
    1);
    SET @LoginId = SCOPE_IDENTITY()

    -- insert to UserInfo table
    INSERT INTO UserInfo (UserLoginId, FullName, Email, Phone, EngagementTypeId, EmployeeCode, UserCategoryId, DivisionId, DepartmentId, DesignationId, TenantOfficeId, GenderId, ReportingManagerId, ExpiryDate,DocumentUrl,DocumentSize, CreatedBy, CreatedOn, IsActive, IsDeleted, UserGradeId) 
    VALUES(@LoginId, @FullName, @Email, @Phone, @EngagementTypeId, @EmployeeCode, @UserCategoryId, @DivisionId, @DepartmentId, @DesignationId, @TenantOfficeId, @GenderId, @ReportingManagerId, @UserExpiryDate, @DocumentUrl,@DocumentSize, @CreatedBy, GETUTCDATE(), 1, 0,@UserGradeId) 
    SET @UserId = SCOPE_IDENTITY()

    -- Insert into UserBusinessUnit
    INSERT INTO UserBusinessUnit (BusinessUnitId, UserId, CreatedBy, CreatedOn)
    SELECT 
        VALUE AS BusinessUnitId,
        @UserId,
        @CreatedBy,
        GETUTCDATE()
    FROM STRING_SPLIT(@BusinessUnits, ',');

    -- separate each role from the string
    SET @UserRoles = @UserRoles + ',';
    WHILE(@start <= LEN(@UserRoles))
    BEGIN
        SET @length = (CHARINDEX(',', @UserRoles, @start) - @start);
        SET @RoleId = SUBSTRING(@UserRoles, @start, @length);
        -- insert to UserRoles
        INSERT INTO UserRole(RoleId, UserId, CreatedOn) VALUES(@RoleId, @UserId, GETUTCDATE())
        SET @start = (CHARINDEX(',', @UserRoles, @start) + 1);
    END

    IF(@EngineerCategory IS NOT NULL)
    BEGIN
        INSERT INTO 
            ServiceEngineerInfo 
            (UserInfoId, EngineerLevel, EngineerCategory, EngineerType, [Address], EngineerGeolocation, CityId, CountryId, StateId, Pincode)
        VALUES(@UserId, @EngineerLevel, @EngineerCategory, @EngineerType, @EngineerAddress, @EngineerGeolocation, @EngineerCityId, @EngineerCountryId, @EngineerStateId, @EngineerPincode)    
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
        INSERT INTO ContractManpowerAllocation (        
            BudgetedAmount,
            EndDate,
            StartDate,
            CustomerAgreedAmount,
            CustomerSiteId,
            ContractId,
            EmployeeId,
            MarginAmount,
            AllocationStatusId,
			CreatedBy,
			CreatedOn
        ) 
        VALUES(
        @BudgetedAmount,
        @EndDate,
        @StartDate,
        @CustomerAgreedAmount,
        @CustomerSiteId,
        @ContractId,
        @UserId,
        @MarginAmount,
        @ManpowerAllocationStatusId,
		@CreatedBy,
		GETUTCDATE()
        );
    END

	IF (@ApprovalRequestId IS NOT NULL)
	BEGIN
			UPDATE ApprovalRequest
		SET 
			IsCompleted =1
		WHERE Id= @ApprovalRequestId
	END
    COMMIT TRANSACTION;
END;
