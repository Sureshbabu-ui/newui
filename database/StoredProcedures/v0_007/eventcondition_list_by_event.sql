
CREATE OR ALTER PROCEDURE [dbo].[eventcondition_list_by_event]
    @EventId INT,
    @Search VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

	SELECT
		AE.EventName,
		AE.Id EventId,
		EG.EventGroupName
	FROM
		ApprovalEvent AE
		INNER JOIN EventGroup EG ON EG.Id = AE.EventGroupId
	WHERE AE.Id = @EventId;

    SELECT 
     EC.Id,
	 EC.ConditionName,
	 EC.Sequence,
	 EC.ConditionValue,
	 EC.ApprovalWorkflowId,
	 AW.[Name] WorkflowName
    FROM
	    EventCondition EC
		LEFT JOIN ApprovalWorkFlow AW ON AW.Id = EC.ApprovalWorkflowId

    WHERE
	    EC.ApprovalEventId = @EventId AND
        (ISNULL(@Search, '') = '' OR
         EC.[ConditionName] LIKE '%' + @Search + '%' OR
         AW.[Name] LIKE '%' + @Search + '%')
    ORDER BY 
        EC.Sequence ASC

END
