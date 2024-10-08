CREATE OR ALTER PROCEDURE [dbo].[eventcondition_update]
   @EventConditionId INT,
   @ApprovalWorkflowId INT,
   @ConditionName VARCHAR(64),
   @ConditionValue VARCHAR(2048) = NULL,
   @UpdatedBy INT
AS
BEGIN 
	SET NOCOUNT ON;

	UPDATE EventCondition
	SET	
		ConditionName = @ConditionName,
		ConditionValue = @ConditionValue,
		ApprovalWorkflowId = @ApprovalWorkflowId,
		UpdatedBy = @UpdatedBy,
		UpdatedOn = GETUTCDATE()
	WHERE
		Id = @EventConditionId
END