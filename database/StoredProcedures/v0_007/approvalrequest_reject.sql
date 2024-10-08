CREATE OR ALTER PROCEDURE [dbo].[approvalrequest_reject]
	@ReviewedBy INT,
	@ReviewComment VARCHAR(128),
	@ApprovalRequestDetailId INT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @ReviewStatusId INT;
	DECLARE @ApprovalRequestId INT;
	SELECT @ReviewStatusId = Id FROM MasterEntityData WHERE Code = 'ARS_RJTD'
	SELECT @ApprovalRequestId = ApprovalRequestId FROM ApprovalRequestDetail WHERE Id = @ApprovalRequestDetailId

   UPDATE ApprovalRequestDetail 
	SET ReviewedBy		=	@ReviewedBy,
		ReviewedOn		=	GETUTCDATE(),
		ReviewStatusId	=	@ReviewStatusId,
		ReviewComment	=	@ReviewComment  
	WHERE Id = @ApprovalRequestDetailId

	   UPDATE ApprovalRequestDetail 
	SET 
		ReviewStatusId	=	@ReviewStatusId
	WHERE  ApprovalRequestId = @ApprovalRequestId AND Id != @ApprovalRequestDetailId

	UPDATE ApprovalRequest
	SET ReviewStatusId = @ReviewStatusId,
		IsCompleted =1 
	WHERE Id = @ApprovalRequestId
END