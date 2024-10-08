CREATE OR ALTER PROCEDURE [dbo].[approvalrequest_create]
    @Content NVARCHAR(MAX),
    @CreatedBy INT,
	@ApprovalEventCode VARCHAR(32),
    @ApprovalWorkflowList NVARCHAR(MAX)
AS
BEGIN 
    SET NOCOUNT ON;
    DECLARE @TenantOfficeId INT;
    DECLARE @ReviewStatusId INT;
    DECLARE @EventConditionId INT;
	DECLARE @ApprovalEventId INT = (SELECT Id FROM ApprovalEvent WHERE EventCode = @ApprovalEventCode);
	
	SELECT @ReviewStatusId = Id FROM MasterEntityData WHERE Code = 'ARS_SMTD';

    BEGIN TRANSACTION
    
	SET @TenantOfficeId =(SELECT TenantOfficeId FROM UserInfo WHERE Id =@CreatedBy)

    SELECT TOP 1 @EventConditionId = EventConditionId
    FROM OPENJSON(@ApprovalWorkflowList)
    WITH (EventConditionId INT, Sequence INT);

    INSERT INTO ApprovalRequest 
    (
		CaseId, 
		EventConditionId, 
		ApprovalEventId,
		Content, 
		CreatedBy,
		CreatedOn, 
		ReviewStatusId,
		TenantOfficeId
	)
    SELECT
    
		1, 
		@EventConditionId, 
		@ApprovalEventId,
		@Content, 
		@CreatedBy, 
		GETUTCDATE(), 
		@ReviewStatusId,
		ISNULL(TenantOfficeId,@TenantOfficeId)
	FROM OPENJSON(@Content)
    WITH (
		TenantOfficeId INT
	);

    DECLARE @ApprovalRequestId INT = SCOPE_IDENTITY();

    -- Update CaseId in ApprovalRequest
    UPDATE ApprovalRequest
    SET CaseId = @ApprovalRequestId
    WHERE Id = @ApprovalRequestId;

    INSERT INTO ApprovalRequestDetail
    (
		ApprovalRequestId, 
		RoleId,
		ApproverUserId,
		Sequence, 
		CreatedBy, 
		CreatedOn, 
		ReviewStatusId
	)
    SELECT
        @ApprovalRequestId,
		ApproverRoleId, 
		ApproverUserId,
		Sequence, 
		@CreatedBy,
		GETUTCDATE(),
		@ReviewStatusId
    FROM OPENJSON(@ApprovalWorkflowList)
    WITH (
		ApproverRoleId INT, 
		ApproverUserId INT,
		Sequence INT
	);

    COMMIT TRANSACTION;
END;