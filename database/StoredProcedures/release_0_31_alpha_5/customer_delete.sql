CREATE OR ALTER   PROCEDURE [dbo].[customer_delete]
    @Id	INT,
    @DeletedBy	INT
AS
BEGIN 
    SET NOCOUNT ON;
    UPDATE ApprovalRequest
    SET 
        ApprovalRequest.IsDeleted = 1,
        ApprovalRequest.DeletedBy = @DeletedBy,
        ApprovalRequest.DeletedOn = GETUTCDATE() 
    FROM ApprovalRequest AR
    INNER JOIN MasterEntityData ReviewStatus ON ReviewStatus.Id = AR.ReviewStatus
    WHERE 
        AR.Id = @Id AND
        AR.TableName = 'Customer' AND
        ReviewStatus.Code IN ('ARS_DRFT', 'ARS_RJTD');
END