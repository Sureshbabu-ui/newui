CREATE OR ALTER PROCEDURE [dbo].[bank_pending_detail]
	@ApprovalRequestId	INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		GETUTCDATE() AS 'FetchTime',
		AR.Id ApprovalRequestId,
		ARD.Id ApprovalRequestDetailId,
		AR.CaseId,
		AR.Content,
		JSON_VALUE(AR.Content, '$.BankCode') BankCode,
		JSON_VALUE(AR.Content, '$.BankName') BankName,
		AE.EventCode TableName, 
		RS.Code ReviewStatus,
		RS.Name ReviewStatusName,
		AR.CreatedOn,
		AR.CreatedBy,
		CU.FullName AS CreatedUserName
	FROM ApprovalRequestDetail ARD
	INNER JOIN ApprovalRequest AR ON AR.Id= ARD.ApprovalRequestId
		INNER JOIN EventCondition EC ON EC.Id = AR.EventConditionId
	INNER JOIN ApprovalEvent AE ON AE.Id = EC.ApprovalEventId
	INNER JOIN ApprovalWorkflow AWF ON AWF.Id = EC.ApprovalWorkflowId
	LEFT JOIN UserInfo CU ON AR.CreatedBy=CU.Id 
	LEFT JOIN MasterEntityData RS ON  RS.Id = AR.ReviewStatusId
	WHERE 
		AR.Id = @ApprovalRequestId

	SELECT 
		ARD.Id,
		ARD.Sequence,
		ARD.ReviewedOn, 
		RS.Code ReviewStatusCode,
		RS.Name ReviewStatusName,
		ARD.ReviewComment,
        RU.FullName AS ReviewedBy
	FROM ApprovalRequestDetail ARD
	INNER JOIN ApprovalRequest AR ON AR.Id =ARD.ApprovalRequestId
	LEFT JOIN UserInfo RU ON ARD.ReviewedBy=RU.Id
	LEFT JOIN MasterEntityData RS ON  RS.Id = ARD.ReviewStatusId
	WHERE 
		AR.CaseId = (SELECT CaseId FROM ApprovalRequest WHERE Id =@ApprovalRequestId) AND
		ARD.ReviewedOn IS NOT NULL
END