CREATE OR ALTER PROCEDURE [dbo].[approvalrequest_approve]
    @ApprovalRequestDetailId INT,
    @ApprovalWorkflowList NVARCHAR(MAX),
    @ApprovedBy INT,
    @ReviewComment NVARCHAR(MAX)
AS
BEGIN 
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    
    DECLARE @ReviewStatusId INT;
    DECLARE @Content NVARCHAR(MAX);
	DECLARE @ApprovalRequestId INT;
	DECLARE @TenantOfficeId INT;

    SELECT @ReviewStatusId = Id FROM MasterEntityData WHERE Code = 'ARS_APRV';
    SELECT @Content = AR.Content ,@ApprovalRequestId = AR.Id
    FROM ApprovalRequest AR
    INNER JOIN ApprovalRequestDetail ARD ON ARD.ApprovalRequestId = AR.Id
    WHERE ARD.Id = @ApprovalRequestDetailId;
	SELECT @TenantOfficeId =TenantOfficeId FROM ApprovalRequest WHERE Id =@ApprovalRequestId;


    BEGIN TRANSACTION;
    
    

	UPDATE ApprovalRequestDetail
	SET ReviewStatusId = @ReviewStatusId
	 WHERE ApprovalRequestId = @ApprovalRequestId


		UPDATE ApprovalRequestDetail
		SET ReviewStatusId = @ReviewStatusId,
		 ReviewComment = @ReviewComment,
		 ReviewedBy= @ApprovedBy,	
		 ReviewedOn = GETUTCDATE()
		 WHERE Id = @ApprovalRequestDetailId



        --DECLARE @NewApprovalRequestId INT = SCOPE_IDENTITY();

        -- Update CaseId in ApprovalRequest
        --UPDATE ApprovalRequest
        --SET CaseId = @ApprovalRequestId
        --WHERE Id = @ApprovalRequestId;

        -- Insert into ApprovalRequestDetail
        INSERT INTO ApprovalRequestDetail
        (
			ApprovalRequestId,
			RoleId, 
			ApproverUserId,
			Sequence,
			CreatedBy, 
			CreatedOn, 
			ReviewStatusId
		)
        SELECT
            @ApprovalRequestId,
			ApproverRoleId, 
			ApproverUserId,
			Sequence, 
            (SELECT AR.CreatedBy FROM ApprovalRequest AR
             INNER JOIN ApprovalRequestDetail ARD ON ARD.ApprovalRequestId = AR.Id
             WHERE ARD.Id = @ApprovalRequestDetailId),
            GETUTCDATE(), 
		    (SELECT Id FROM MasterEntityData WHERE Code = 'ARS_SMTD')
        FROM OPENJSON(@ApprovalWorkflowList)
        WITH (ApproverRoleId INT,ApproverUserId INT, Sequence INT);
    

    COMMIT TRANSACTION;
END;
