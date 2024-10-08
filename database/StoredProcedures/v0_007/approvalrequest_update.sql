CREATE OR ALTER PROCEDURE [dbo].[approvalrequest_update]
	@ApprovalRequestId	INT,
	@Content			NVARCHAR(MAX),
    @LoggedUserId		INT,
    @ApprovalWorkflowList NVARCHAR(MAX)

AS 
BEGIN 
	SET NOCOUNT ON; 

	DECLARE @ReviewStatusId INT;
	DECLARE @TenantOfficeId INT;
	DECLARE @EventConditionId INT;

    BEGIN TRANSACTION

	SELECT @ReviewStatusId = Id FROM MasterEntityData WHERE Code = 'ARS_SMTD';
	SELECT @TenantOfficeId = TenantOfficeId FROM UserInfo WHERE Id =@LoggedUserId

    SELECT TOP 1 @EventConditionId = EventConditionId
	    FROM OPENJSON(@ApprovalWorkflowList)
    WITH (EventConditionId INT, Sequence INT);

	 INSERT INTO ApprovalRequest 
    (
		CaseId, 
		EventConditionId, 
		Content, 
		CreatedBy,
		CreatedOn, 
		ReviewStatusId,
		TenantOfficeId
	)
    VALUES
    (
	    (SELECT CaseId FROM ApprovalRequest WHERE Id =@ApprovalRequestId), 
		@EventConditionId, 
		@Content, 
		@LoggedUserId, 
		GETUTCDATE(), 
		@ReviewStatusId,
		@TenantOfficeId
	);

    DECLARE @NewApprovalRequestId INT = SCOPE_IDENTITY();

    UPDATE ApprovalRequest
	SET 
	IsCompleted =1
	WHERE 
		Id = @ApprovalRequestId
  
    INSERT INTO ApprovalRequestDetail
    (
		ApprovalRequestId, 
		RoleId, 
		Sequence, 
		CreatedBy, 
		CreatedOn, 
		ReviewStatusId
	)
    SELECT
        @NewApprovalRequestId,
		ApproverRoleId, 
		Sequence, 
		@LoggedUserId,
		GETUTCDATE(),
		@ReviewStatusId
    FROM OPENJSON(@ApprovalWorkflowList)
    WITH (
		ApproverRoleId INT, 
		Sequence INT
	);


COMMIT TRANSACTION
END