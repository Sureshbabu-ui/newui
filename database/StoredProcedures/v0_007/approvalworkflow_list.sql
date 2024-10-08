CREATE OR ALTER PROCEDURE [dbo].[approvalworkflow_list]
    @Search varchar(50) = NULL
AS
BEGIN 
    SET NOCOUNT ON;

;WITH DistinctWorkFlowDetailSequence AS (
    SELECT 
        ApprovalWorkflowId,
        MAX(Sequence) AS SequenceCount
    FROM ApprovalWorkflowDetail
        WHERE IsActive = 1
    GROUP BY ApprovalWorkflowId
)
    SELECT 
        AWF.Id,
        AWF.[Name],
		AWF.[Description],
		DFDS.SequenceCount,
		AWF.CreatedOn,
		AWF.IsActive
    FROM
        ApprovalWorkFlow  AWF
        LEFT JOIN DistinctWorkFlowDetailSequence DFDS  ON DFDS.ApprovalWorkflowId = AWF.Id
    WHERE
		 ( ISNULL(@Search, '') = '' OR AWF.[Name] LIKE '%' + @Search + '%' )

    ORDER BY AWF.Id DESC;
END