CREATE OR ALTER PROCEDURE [dbo].[approvalworkflowdetail_list]
    @ApprovalWorkflowId INT,
    @Search VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

	SELECT
		Id, 
		[Name], 
		[Description], 
		IsActive,
		CreatedOn
	FROM
		ApprovalWorkflow
	WHERE Id = @ApprovalWorkflowId;

    SELECT 
        AWFD.Id,
		AWFD.ApproverRoleId,
		AWFD.ApproverUserId,
        R.[Name] AS RoleName,
        AU.FullName ApproverUserName,
        AWFD.[Sequence],
        AWFD.CreatedOn,
        AWFD.IsActive
    FROM
        ApprovalWorkFlowDetail AWFD
        LEFT JOIN [Role] R ON R.Id = AWFD.ApproverRoleId
        LEFT JOIN UserInfo AU ON AU.Id = AWFD.ApproverUserId
    WHERE
	    AWFD.ApprovalWorkflowId = @ApprovalWorkflowId AND
        (ISNULL(@Search, '') = '' OR
         R.[Name] LIKE '%' + @Search + '%' OR
         AU.FullName LIKE '%' + @Search + '%')
    ORDER BY 
        AWFD.[Sequence] ASC
END
