CREATE OR ALTER PROCEDURE [dbo].[customer_pending_list]
    @Page INT = 1,
    @PerPage INT = 10,
    @SearchText VARCHAR(50) = NULL,
	@SearchWith VARCHAR(50) = NULL,
	@ApprovalEventCode VARCHAR(32)
AS 
BEGIN
    SET NOCOUNT ON;
    IF @Page < 1
    SET @Page = 1;
    SELECT 
        AR.Id ApprovalRequestId, 
		ARD.Id ApprovalRequestDetailId,
        AR.Content,
        AE.EventCode EventCode,
        AE.EventName EventName,
        ReviewStatus.Code AS ReviewStatus,
		ReviewStatus.[Name] ReviewStatusName,
        CU.FullName AS CreatedUserName, 
		AR.CreatedBy,
		AR.CreatedOn,
		ARD.RoleId
    FROM ApprovalRequest AR
		INNER JOIN ApprovalRequestDetail ARD ON ARD.ApprovalRequestId =AR.Id
		INNER JOIN TenantOffice ON TenantOffice.Id = AR.TenantOfficeId
		INNER JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
		INNER JOIN EventCondition EC ON EC.Id = AR.EventConditionId
		INNER JOIN ApprovalEvent AE ON AE.Id = AR.ApprovalEventId
		LEFT JOIN UserInfo CU ON AR.CreatedBy = CU.Id 
		LEFT JOIN UserInfo RU ON ARD.ReviewedBy = RU.Id 
		INNER JOIN MasterEntityData ReviewStatus ON  ReviewStatus.Id = ARD.ReviewStatusId
    WHERE
		(AE.EventCode = @ApprovalEventCode) AND
		((ReviewStatus.Code NOT IN ('ARS_APRV' , 'ARS_DRFT') AND AR.IsCompleted = 0 ) OR( ReviewStatus.Code='ARS_RJTD' AND AR.IsCompleted =1) ) AND 
		(@SearchText IS NULL OR (@SearchWith = 'TenantOfficeInfo' AND TenantOffice.OfficeName LIKE  '%'+ @SearchText + '%'))
    ORDER BY AR.Id DESC 
    OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END