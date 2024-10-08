CREATE OR ALTER PROCEDURE [dbo].[approvalrequest_review_list]
	@ApprovalRequestDetailId	INT=NULL,
	@ApprovalRequestId	INT= NULL,
	@LoggedUserId INT

AS
BEGIN 
	SET NOCOUNT ON;
	IF(@ApprovalRequestDetailId IS NOT NULL)
	BEGIN
		SET @ApprovalRequestId = (SELECT ApprovalRequestId FROM ApprovalRequestDetail WHERE Id= @ApprovalRequestDetailId)
	END

	SELECT 
		ARD.Id,
		ARD.Sequence,
		ARD.ReviewedOn, 
		RS.Code ReviewStatusCode,
		RS.Name ReviewStatusName,
		ARD.ReviewComment,
        RU.FullName AS ReviewedBy
	FROM ApprovalRequestDetail ARD
	LEFT JOIN ApprovalRequest AR ON AR.Id =ARD.ApprovalRequestId
	LEFT JOIN UserInfo RU ON ARD.ReviewedBy=RU.Id
	LEFT JOIN MasterEntityData RS ON  RS.Id = ARD.ReviewStatusId
	WHERE 
		AR.CaseId = (SELECT CaseId FROM ApprovalRequest WHERE Id =@ApprovalRequestId) AND
		ARD.ReviewedOn IS NOT NULL 
END