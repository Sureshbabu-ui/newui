CREATE OR ALTER PROCEDURE [dbo].[approvalworkflowdetail_update]
	@Id INT,
	@Sequence INT,
	@ApproverRoleId INT = NULL,
	@ApproverUserId INT = NULL,
	@IsActive BIT,
    @ModifiedBy INT
AS
BEGIN 
    SET NOCOUNT ON;

	UPDATE ApprovalWorkflowDetail
	SET
		[Sequence] = @Sequence,
		ApproverRoleId = @ApproverRoleId,
		ApproverUserId = @ApproverUserId,
		IsActive = @IsActive,
		ModifiedBy = @ModifiedBy,
		ModifiedOn = GETUTCDATE()
	WHERE Id = @Id;
END