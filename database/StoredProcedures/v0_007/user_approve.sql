CREATE OR ALTER PROCEDURE [dbo].[user_approve]
    @ApprovalRequestDetailId INT =NULL,
    @ReviewedBy INT,
    @ReviewComment VARCHAR(128)=NULL,
	@PassCode VARCHAR(256),
	@DocumentUrl VARCHAR(256)
AS
BEGIN 
    SET NOCOUNT ON; 
    SET XACT_ABORT ON;
    
    DECLARE @ReviewStatusId INT;
    DECLARE @Content NVARCHAR(MAX);
	DECLARE @ApprovalRequestId INT ;
	DECLARE @CreatedOn DATETIME =GETUTCDATE();
	DECLARE @CreatedBy INT;
	
    DECLARE @start INT = 1;
    DECLARE @length INT = 0;
    DECLARE @RoleId INT;
    DECLARE @LoginId INT;
	DECLARE @EngineerCategoryIsRe INT;    
	DECLARE @UserId INT;


	SELECT @EngineerCategoryIsRe =  Id FROM MasterEntityData WHERE Code = 'ETP_RENG'
    BEGIN TRANSACTION;

    SELECT @ReviewStatusId = Id FROM MasterEntityData WHERE Code = 'ARS_APRV';

	IF(@ApprovalRequestDetailId IS NOT NULL)
	BEGIN
		SELECT
			@Content = AR.Content ,
			@ApprovalRequestId = AR.Id,
			@CreatedBy =AR.CreatedBy,
			@CreatedOn =AR.CreatedOn
		FROM ApprovalRequest AR
		INNER JOIN ApprovalRequestDetail ARD ON ARD.ApprovalRequestId = AR.Id
		WHERE ARD.Id = @ApprovalRequestDetailId;
    DECLARE @EmployeeCode VARCHAR(50) = JSON_VALUE(@Content, '$.EmployeeCode');
    DECLARE @IsConcurrentLoginAllowed BIT = JSON_VALUE(@Content, '$.IsConcurrentLoginAllowed');
    DECLARE @FullName VARCHAR(100) = JSON_VALUE(@Content, '$.FullName');
    DECLARE @Email VARCHAR(100) = JSON_VALUE(@Content, '$.Email');
    DECLARE @Phone VARCHAR(20) = JSON_VALUE(@Content, '$.Phone');
    DECLARE @EngagementTypeId INT = JSON_VALUE(@Content, '$.EngagementTypeId');
    DECLARE @UserCategoryId INT = JSON_VALUE(@Content, '$.UserCategoryId');
    DECLARE @DivisionId INT = JSON_VALUE(@Content, '$.DivisionId');
    DECLARE @DepartmentId INT = JSON_VALUE(@Content, '$.DepartmentId');
    DECLARE @DesignationId INT = JSON_VALUE(@Content, '$.DesignationId');
    DECLARE @TenantOfficeId INT = JSON_VALUE(@Content, '$.TenantOfficeId');
    DECLARE @GenderId INT = JSON_VALUE(@Content, '$.GenderId');
    DECLARE @ReportingManagerId INT = JSON_VALUE(@Content, '$.ReportingManagerId');
    DECLARE @UserExpiryDate DATETIME = JSON_VALUE(@Content, '$.UserExpiryDate');
    DECLARE @DocumentSize BIGINT = JSON_VALUE(@Content, '$.DocumentSize');
    DECLARE @BusinessUnits VARCHAR(MAX) = JSON_VALUE(@Content, '$.BusinessUnits');
    DECLARE @UserRoles VARCHAR(MAX) = JSON_VALUE(@Content, '$.UserRoles');
    DECLARE @EngineerCategory VARCHAR(50) = JSON_VALUE(@Content, '$.EngineerCategory');
    DECLARE @EngineerGeolocation VARCHAR(255) = JSON_VALUE(@Content, '$.EngineerGeolocation');
    DECLARE @EngineerAddress VARCHAR(255) = JSON_VALUE(@Content, '$.EngineerAddress');
    DECLARE @EngineerCityId INT = JSON_VALUE(@Content, '$.EngineerCityId');
    DECLARE @EngineerCountryId INT = JSON_VALUE(@Content, '$.EngineerCountryId');
    DECLARE @EngineerPincode VARCHAR(20) = JSON_VALUE(@Content, '$.EngineerPincode');
    DECLARE @EngineerStateId INT = JSON_VALUE(@Content, '$.EngineerStateId');
    DECLARE @EngineerLevel INT = JSON_VALUE(@Content, '$.EngineerLevel');
    DECLARE @EngineerType VARCHAR(50) = JSON_VALUE(@Content, '$.EngineerType');
    DECLARE @CustomerAgreedAmount DECIMAL(16,2) = JSON_VALUE(@Content, '$.CustomerAgreedAmount');
    DECLARE @BudgetedAmount DECIMAL(16,2) = JSON_VALUE(@Content, '$.BudgetedAmount');
    DECLARE @EndDate DATETIME = JSON_VALUE(@Content, '$.EndDate');
    DECLARE @StartDate DATETIME = JSON_VALUE(@Content, '$.StartDate');
    DECLARE @CustomerSiteId INT = JSON_VALUE(@Content, '$.CustomerSiteId');
    DECLARE @ContractId INT = JSON_VALUE(@Content, '$.ContractId');
	DECLARE @UserGradeId INT = JSON_VALUE(@Content, '$.UserGradeId');
	END

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
    @PassCode,
    GETUTCDATE(),
    @CreatedBy,
    @IsConcurrentLoginAllowed,
    1);
    SET @LoginId = SCOPE_IDENTITY()

    -- insert to UserInfo table
    INSERT INTO UserInfo (UserLoginId, FullName, Email, Phone, EngagementTypeId, EmployeeCode, UserCategoryId, DivisionId, DepartmentId, DesignationId, TenantOfficeId, GenderId, ReportingManagerId, ExpiryDate,DocumentUrl,DocumentSize, CreatedBy, CreatedOn, IsActive, IsDeleted, UserGradeId) 
    VALUES(@LoginId, @FullName, @Email, @Phone, @EngagementTypeId, @EmployeeCode, @UserCategoryId, @DivisionId, @DepartmentId, @DesignationId, @TenantOfficeId, @GenderId, @ReportingManagerId, @UserExpiryDate, @DocumentUrl,@DocumentSize, @CreatedBy, GETUTCDATE(), 1, 0, @UserGradeId) 
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

		UPDATE ApprovalRequest
		SET 
			IsCompleted =1,
			ApprovedRecordId =@UserId
		WHERE Id= @ApprovalRequestId

		UPDATE ApprovalRequestDetail
		SET
			ReviewedBy = @ReviewedBy,
			ReviewedOn = GETUTCDATE(),
			ReviewStatusId = @ReviewStatusId,
			ReviewComment = @ReviewComment
		WHERE Id = @ApprovalRequestDetailId;

		UPDATE ApprovalRequest
			SET ReviewStatusId = @ReviewStatusId
			WHERE Id = @ApprovalRequestId

    COMMIT TRANSACTION;
END;