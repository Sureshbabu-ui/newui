CREATE OR ALTER PROCEDURE [dbo].[approvalrequest_delete]
	@ApprovalRequestId INT,
	@DeletedBy INT,
	@IsRestricted BIT OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
	BEGIN TRANSACTION
	SET @IsRestricted =0
	
	-- Delete from ApprovalRequestDetail if ReviewStatus is not in the restricted set
    DELETE ApprovalRequestDetail
    FROM ApprovalRequestDetail
    LEFT JOIN ApprovalRequest AR ON AR.Id = ApprovalRequestDetail.ApprovalRequestId
    WHERE ApprovalRequestDetail.ApprovalRequestId = @ApprovalRequestId
    AND AR.ReviewStatusId IN (
        SELECT ReviewStatus.Id 
        FROM MasterEntityData ReviewStatus
        WHERE ReviewStatus.Code IN ('ARS_RJTD', 'ARS_SMTD')
    );

    -- Delete from ApprovalRequest if ReviewStatus is not in the restricted set
    DELETE FROM ApprovalRequest
    WHERE Id = @ApprovalRequestId
    AND ReviewStatusId IN (
        SELECT Id 
        FROM MasterEntityData
        WHERE Code IN ('ARS_DRFT', 'ARS_RJTD', 'ARS_SMTD')
    );

    COMMIT TRANSACTION
    END TRY
    BEGIN CATCH
    -- Check if the error is a foreign key constraint violation
    IF ERROR_NUMBER() = 547
    BEGIN
		SET @IsRestricted =1
    END
    END CATCH;
END;