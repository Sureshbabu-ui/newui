CREATE OR ALTER PROCEDURE [dbo].[approvalworkflowdetail_create]
	@ApprovalWorkflowId INT,
	@Sequence INT,
	@ApproverRoleId INT = NULL,
	@ApproverUserId INT = NULL,
	@IsActive BIT,
    @CreatedBy INT
AS
BEGIN 
    SET NOCOUNT ON;

	INSERT INTO ApprovalWorkflowDetail
	(
		ApprovalWorkflowId,
		[Sequence],
		ApproverRoleId,
		ApproverUserId,
		IsActive,
		CreatedBy,
		CreatedOn
	)
	VALUES
	(
		@ApprovalWorkflowId,
		@Sequence,
		@ApproverRoleId,
		@ApproverUserId,
		@IsActive,
		@CreatedBy,
		GETUTCDATE()
	)
END