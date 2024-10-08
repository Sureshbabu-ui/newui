CREATE OR ALTER PROCEDURE [dbo].[customer_approve]
    @ApprovalRequestDetailId INT =NULL,
    @ReviewedBy INT,
    @ReviewComment VARCHAR(128)=NULL
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
	DECLARE @UserId INT;


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
		
		DECLARE @CustomerCode VARCHAR(32)
		EXEC dbo.documentnumberformat_get_nextnumber
		@DocumentTypeCode = 'DCT_CUST', 
		@DocumentNumber = @CustomerCode OUTPUT
   		DECLARE @Name VARCHAR(64) = JSON_VALUE(@Content, '$.Name');
		DECLARE @NameOnPrint VARCHAR(64) =  JSON_VALUE(@Content, '$.NameOnPrint');
		DECLARE @PrimaryContactName VARCHAR(128) =  JSON_VALUE(@Content, '$.PrimaryContactName');
		DECLARE @PrimaryContactEmail VARCHAR(64) =  JSON_VALUE(@Content, '$.PrimaryContactEmail');
		DECLARE @PrimaryContactPhone VARCHAR(16) =  JSON_VALUE(@Content, '$.PrimaryContactPhone');
		DECLARE @SecondaryContactEmail VARCHAR(64) =  JSON_VALUE(@Content, '$.SecondaryContactEmail');	
		DECLARE @SecondaryContactName VARCHAR(128) =  JSON_VALUE(@Content, '$.SecondaryContactName');
		DECLARE @SecondaryContactPhone VARCHAR(16) =  JSON_VALUE(@Content, '$.SecondaryContactPhone');
		DECLARE @PanNumber VARCHAR(16) = JSON_VALUE(@Content, '$.PanNumber');	
		DECLARE @TinNumber VARCHAR(16) = JSON_VALUE(@Content, '$.TinNumber');
		DECLARE @TanNumber VARCHAR(16) = JSON_VALUE(@Content, '$.TanNumber');
		DECLARE @CinNumber VARCHAR(21) = JSON_VALUE(@Content, '$.CinNumber');
		DECLARE @BilledToAddress VARCHAR(128) = JSON_VALUE(@Content, '$.BilledToAddress');
		DECLARE @BilledToPincode VARCHAR(16) = JSON_VALUE(@Content, '$.BilledToPincode');
		DECLARE @BilledToGstNumber VARCHAR(16) = JSON_VALUE(@Content, '$.BilledToGstNumber');	
		DECLARE @BilledToCityId INT = JSON_VALUE(@Content, '$.BilledToCityId');
		DECLARE @BilledToCountryId INT = JSON_VALUE(@Content, '$.BilledToCountryId');
		DECLARE @BilledToStateId INT = JSON_VALUE(@Content, '$.BilledToStateId');
		DECLARE @ShippedToAddress  VARCHAR(128) = JSON_VALUE(@Content, '$.ShippedToAddress');
		DECLARE @ShippedToPincode VARCHAR(16) = JSON_VALUE(@Content, '$.ShippedToPincode');
		DECLARE @ShippedToGstNumber VARCHAR(16) = JSON_VALUE(@Content, '$.ShippedToGstNumber');	
		DECLARE @ShippedToCityId INT = JSON_VALUE(@Content, '$.ShippedToCityId');
		DECLARE @ShippedToCountryId INT = JSON_VALUE(@Content, '$.ShippedToCountryId');
		DECLARE @ShippedToStateId INT = JSON_VALUE(@Content, '$.ShippedToStateId');
		DECLARE @MsmeRegistrationNumber VARCHAR(24) = JSON_VALUE(@Content, '$.MsmeRegistrationNumber');
		DECLARE @IsMsme BIT = JSON_VALUE(@Content, '$.IsMsme');
		DECLARE @CustomerGroupId INT = JSON_VALUE(@Content, '$.CustomerGroupId');
		DECLARE @CustomerIndustryId INT = JSON_VALUE(@Content, '$.CustomerIndustryId');
		DECLARE @TenantOfficeId INT = JSON_VALUE(@Content, '$.TenantOfficeId');
		DECLARE @GstTypeId INT = JSON_VALUE(@Content, '$.GstTypeId');
		DECLARE @IsContractCustomer BIT = JSON_VALUE(@Content, '$.IsContractCustomer');
	END

   -- insert to Customer table
    INSERT INTO Customer ( CustomerCode, CreatedOn, CreatedBy ) VALUES ( @CustomerCode, GETUTCDATE(), @CreatedBy);
    DECLARE @CustomerId INT = SCOPE_IDENTITY();

    -- insert to CustomerInfo table
    INSERT INTO CustomerInfo (
    CustomerId, 
    [Name], 
    NameOnPrint, 
    CustomerGroupId, 
    CustomerIndustryId, 
    TenantOfficeId, 
    PrimaryContactName, 
    PrimaryContactEmail, 
    PrimaryContactPhone, 
    SecondaryContactName, 
    SecondaryContactEmail, 
    SecondaryContactPhone, 
    PanNumber, 
    TinNumber, 
    TanNumber, 
    CinNumber, 
    BilledToAddress, 
    BilledToCityId, 
    BilledToCountryId, 
	BilledToStateId,
	BilledToPincode,
	BilledToGstNumber,
	ShippedToAddress, 
    ShippedToCityId, 
    ShippedToCountryId, 
	ShippedToStateId,
	ShippedToPincode,
	ShippedToGstNumber,
	IsMsme,
	MsmeRegistrationNumber,
	IsContractCustomer,
	EffectiveFrom,
	IsVerified,
	GstTypeId,
    CreatedBy, 
    CreatedOn, 
    IsActive,
	IsDeleted
) 
VALUES (
    @CustomerId, 
    @Name, 
    @NameOnPrint, 
    @CustomerGroupId, 
    @CustomerIndustryId, 
    @TenantOfficeId, 
    @PrimaryContactName, 
    @PrimaryContactEmail, 
    @PrimaryContactPhone, 
    @SecondaryContactName, 
    @SecondaryContactEmail, 
    @SecondaryContactPhone, 
    @PanNumber, 
    @TinNumber, 
    @TanNumber, 
    @CinNumber, 
    @BilledToAddress, 
    @BilledToCityId, 
    @BilledToCountryId,
	@BilledToStateId,
	@BilledToPincode,
	@BilledToGstNumber,
	@ShippedToAddress, 
    @ShippedToCityId, 
    @ShippedToCountryId, 
	@ShippedToStateId,
	@ShippedToPincode,
	@ShippedToGstNumber,
	@IsMsme,
	@MsmeRegistrationNumber,
	@IsContractCustomer,
	GETUTCDATE(),
	0,
	@GstTypeId,
    @CreatedBy, 
    GETUTCDATE(), 
    1,
	0
);

    DECLARE @CustomerInfoId INT = SCOPE_IDENTITY();

	UPDATE ApprovalRequest
	SET 
		IsCompleted =1,
		ApprovedRecordId =@CustomerInfoId
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