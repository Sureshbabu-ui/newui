CREATE OR ALTER PROCEDURE [dbo].[customer_pending_count] 
    @TotalRows    INT OUTPUT,
	@SearchText VARCHAR(50) = NULL,
	@SearchWith VARCHAR(50) = NULL,
	@ApprovalEventCode VARCHAR(32)
AS 
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(AR.Id)
    FROM ApprovalRequest AR
		INNER JOIN ApprovalRequestDetail ARD ON ARD.ApprovalRequestId =AR.Id
		INNER JOIN TenantOffice ON TenantOffice.Id = AR.TenantOfficeId
		INNER JOIN ApprovalEvent AE ON AE.Id = AR.ApprovalEventId
		INNER JOIN MasterEntityData ReviewStatus ON  ReviewStatus.Id = ARD.ReviewStatusId
    WHERE
		(AE.EventCode = @ApprovalEventCode) AND
		((ReviewStatus.Code NOT IN ('ARS_APRV' , 'ARS_DRFT') AND AR.IsCompleted = 0 ) OR( ReviewStatus.Code='ARS_RJTD' AND AR.IsCompleted =1) ) AND 
		(@SearchText IS NULL OR (@SearchWith = 'TenantOfficeInfo' AND TenantOffice.OfficeName LIKE  '%'+ @SearchText + '%'))
END