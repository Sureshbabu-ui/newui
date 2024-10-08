CREATE OR ALTER PROCEDURE [dbo].[eventcondition_create]
   @ApprovalEventId INT,
   @ApprovalWorkflowId INT, 
   @ConditionName VARCHAR(64),
   @ConditionValue VARCHAR(2048) = NULL,
   @CreatedBy INT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE    @Sequence INT =ISNULL((SELECT MAX(Sequence) FROM EventCondition WHERE ApprovalEventId = @ApprovalEventId),0)

	INSERT INTO EventCondition
		(
		ApprovalEventId,
		ApprovalWorkflowId,
		ConditionName,
		ConditionValue,
		Sequence,
		CreatedBy,
		IsActive,
		CreatedOn
		)
  	VALUES 
        (
         @ApprovalEventId,
		 @ApprovalWorkflowId,
		 @ConditionName,
		 @ConditionValue,
	 	 @Sequence+1,
		 @CreatedBy,
		 1,
		 GETUTCDATE()		
		)

END