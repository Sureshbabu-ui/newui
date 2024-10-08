CREATE OR ALTER PROCEDURE [dbo].[approvalrequest_request_change]
	@ReviewedBy INT,
	@ReviewComment VARCHAR(128),
	@ReviewStatus VARCHAR(8),
	@ApprovalRequestDetailId INT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @ApprovedBy VARCHAR(64);
    DECLARE @ReviewStatusId INT;
	DECLARE @ApprovalRequestId INT;
	SELECT @ReviewStatusId = Id FROM MasterEntityData WHERE Code = @ReviewStatus
	SELECT @ApprovalRequestId =ApprovalRequestId FROM ApprovalRequestDetail WHERE Id =@ApprovalRequestDetailId

    UPDATE 
		ApprovalRequestDetail 
	SET ReviewedBy		=	@ReviewedBy,
		ReviewedOn		=	GETUTCDATE(),
		ReviewComment	=	@ReviewComment ,
	    ReviewStatusId =@ReviewStatusId
	WHERE 
		Id = @ApprovalRequestDetailId

		    UPDATE 
		ApprovalRequestDetail 
	SET 
	    ReviewStatusId =@ReviewStatusId
	WHERE 
		ApprovalRequestId = @ApprovalRequestId

		UPDATE ApprovalRequest
		SET ReviewStatusId =@ReviewStatusId
		FROM ApprovalRequest AR
		INNER JOIN ApprovalRequestDetail ARD ON ARD.ApprovalRequestId =AR.Id
		WHERE ARD.Id =@ApprovalRequestDetailId

END