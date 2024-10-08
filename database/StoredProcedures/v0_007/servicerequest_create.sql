CREATE OR ALTER   PROCEDURE [dbo].[servicerequest_create]
	@IsInterimCaseId BIT,
	@IsFinanceApproval BIT,
	@IsPreAmcApproval BIT,
	@CustomerSiteId INT,
    @ContractId INT,    
	@IncidentId VARCHAR(16),    
	@CaseStatusId INT,
    @CallSourceId INT,
	@CustomerReportedIssue VARCHAR(2048), 
	@CustomerServiceAddress VARCHAR(128), 
	@CaseReportedCustomerEmployeeName VARCHAR(64),
	@CaseReportedOn DATETIME,
	@CustomerInfoId INT = NULL,
	@ContractAssetId INT = NULL,
	@ContractInterimAssetId INT,
	@CallTypeId INT,
	@OptedForRemoteSupport INT,
	@RemoteSupportNotOptedReason INT,
	@CustomerContactTypeId INT,
	@EndUserName VARCHAR(64),
	@EndUserPhone VARCHAR(16),
	@EndUserEmail VARCHAR(64),
	@RepairReason VARCHAR(2048),
	@CallCenterRemarks VARCHAR(2048),
	@TicketNumber VARCHAR(16),
	@CallSeverityLevelId INT,
	@CreatedBy INT,
	@IsServiceRequestCreated  INT OUTPUT,
	@IsInterimRequestCreated  INT OUTPUT,
    @ServiceRequestId INT OUTPUT
AS
BEGIN 
SET NOCOUNT ON;
    SET XACT_ABORT ON;
	BEGIN TRANSACTION
    DECLARE @CaseId VARCHAR(18);
	DECLARE @LastCaseId INT;
	DECLARE @CurrentDate DATETIME = GETUTCDATE()
	DECLARE @Year INT = YEAR(@CurrentDate)
	DECLARE @Month INT = MONTH(@CurrentDate)
	DECLARE @TenantOfficeId INT;
	DECLARE @FyStartMonth INT;

	SELECT @FyStartMonth = CONVERT(INT, AppValue) FROM AppSetting WHERE AppKey = 'FyStartMonth';

	IF @Month < @FyStartMonth
	SET @Year = @Year - 1
	SET @Year=@Year%100;
	SET @Year = CONVERT(NVARCHAR(2), @Year)+ CONVERT(NVARCHAR(2),@Year + 1)
 
	IF(@IsInterimCaseId = 1 AND @ContractAssetId IS NULL)
		SET @TenantOfficeId= (SELECT CustomerSite.TenantOfficeId
							FROM ContractInterimAsset
							INNER JOIN CustomerSite ON CustomerSite.Id = ContractInterimAsset.CustomerSiteId
							WHERE ContractInterimAsset.Id =	@ContractInterimAssetId)
	ELSE
		SET @TenantOfficeId= (SELECT CustomerSite.TenantOfficeId
							FROM ContractAssetDetail CAD
							LEFT JOIN Asset A ON A.Id = CAD.AssetId
							INNER JOIN CustomerSite ON CustomerSite.Id = A.CustomerSiteId
							WHERE CAD.Id = @ContractAssetId)

	EXEC [dbo].[documentnumberformat_get_nextnumber]
		@DocumentTypeCode = 'DCT_CID',
		@Year = @Year,
		@TenantOfficeId = @TenantOfficeId,
		@DocumentNumber = @CaseId OUTPUT;

	INSERT INTO ServiceRequest(
		CaseId,
		IsInterimCaseId,
		IsInterimCaseAssetApprovalNeeded,
		ContractId,
		IncidentId,
		TicketNumber,
		CaseStatusId,
		CustomerSiteId,
		ContractAssetId,
		ContractInterimAssetId,
		CallTypeId,
		OptedForRemoteSupport,
		RemoteSupportNotOptedReason,
		CustomerContactTypeId,
		CustomerReportedIssue,
		RepairReason,
		CallcenterRemarks,
		CaseReportedCustomerEmployeeName,
		CaseReportedOn,
		CustomerInfoId,
		EndUserName,
		EndUserPhone,
		EndUserEmail,
		CallSourceId,
		CallSeverityLevelId,
		CustomerServiceAddress,
		CreatedBy,
		CreatedOn
		)

	VALUES (
		@CaseId,
		@IsInterimCaseId,
		CASE WHEN (@IsPreAmcApproval = 1 OR (@IsPreAmcApproval = 0 AND @IsFinanceApproval = 0)) THEN 1 ELSE 0 END, -- Set asset approval needed
		@ContractId,
		@IncidentId,
		@TicketNumber,
		@CaseStatusId,
		@CustomerSiteId,
		@ContractAssetId,
		@ContractInterimAssetId,
		@CallTypeId,
		@OptedForRemoteSupport ,
		@RemoteSupportNotOptedReason ,
		@CustomerContactTypeId ,
		@CustomerReportedIssue,
		@RepairReason,
		@CallCenterRemarks,
		@CaseReportedCustomerEmployeeName,
		@CaseReportedOn,
		@CustomerInfoId,
		@EndUserName,
		@EndUserPhone,
		@EndUserEmail,
		@CallSourceId,
		@CallSeverityLevelId,
		@CustomerServiceAddress,
		@CreatedBy,
	   GETUTCDATE()
	   )

SET @ServiceRequestId = SCOPE_IDENTITY();
		
	UPDATE ServiceRequest
	SET IsInterimCaseId = 
		CASE 
			WHEN (SELECT CallStopDate FROM CONTRACT WHERE Id = @ContractId) < CONVERT(DATE, GETUTCDATE())
			THEN 1 
			ELSE @IsInterimCaseId 
		END,
		IsInterimCaseFinanceApprovalNeeded = 
        CASE 
            WHEN (SELECT CallStopDate FROM CONTRACT WHERE Id = @ContractId) < CONVERT(DATE, GETUTCDATE())
                THEN 1 
            ELSE 0 
        END
	WHERE Id = @ServiceRequestId

	SELECT @IsInterimRequestCreated = IsInterimCaseId FROM ServiceRequest WHERE Id = @ServiceRequestId;
SET @IsServiceRequestCreated = 1

	COMMIT TRANSACTION;
END
