CREATE OR ALTER PROCEDURE [dbo].[user_pending_list]
    @Page INT = 1,
    @PerPage INT = 10,
    @SearchText VARCHAR(50) = NULL,
	@SearchWith VARCHAR(50) = NULL,
	@ApprovalEventCode VARCHAR(16)
AS 
BEGIN
    SET NOCOUNT ON;
    IF @Page < 1
    SET @Page = 1;
    SELECT 
        AR.Id, 
        AR.Content,
        AE.EventCode TableName,
        ReviewStatus.Code AS ReviewStatus,
		AR.CreatedBy,
		UC.[Name] AS UserCategory,	
		DE.[Name] AS Department,
		D.[Name] AS Designation,
		TenantOffice.OfficeName AS Location
    FROM ApprovalRequest AR
	INNER JOIN EventCondition EC ON EC.Id = AR.EventConditionId
	INNER JOIN ApprovalEvent AE ON AE.Id = EC.ApprovalEventId
	INNER JOIN ApprovalWorkflow AWF ON AWF.Id = EC.ApprovalWorkflowId
	INNER JOIN MasterEntityData ReviewStatus ON  ReviewStatus.Id = AR.ReviewStatusId
	LEFT JOIN MasterEntityData UC ON UC.Id= JSON_VALUE(AR.Content, '$.UserCategoryId')
	LEFT JOIN Designation D ON D.Id= JSON_VALUE(AR.Content, '$.DesignationId')
	LEFT JOIN TenantOffice ON TenantOffice.Id = JSON_VALUE(AR.Content, '$.TenantOfficeId')
	LEFT JOIN MasterEntityData DE ON DE.Id= JSON_VALUE(AR.Content, '$.DepartmentId')
    WHERE
		(AE.EventCode = @ApprovalEventCode) AND
		((ReviewStatus.Code NOT IN ('ARS_APRV' , 'ARS_DRFT') AND AR.IsCompleted = 0 ) OR( ReviewStatus.Code='ARS_RJTD' AND AR.IsCompleted =1) ) AND 
        
		(@SearchText IS NULL OR 
			(@SearchWith = 'Department' AND DE.[Name] LIKE '%' + @SearchText + '%')
			OR (@SearchWith = 'UserCategory' AND UC.[Name] LIKE '%' + @SearchText + '%')
			OR (@SearchWith = 'TenantOfficeInfo' AND TenantOffice.OfficeName LIKE  '%'+ @SearchText + '%')
			OR (@SearchWith = 'Email' AND JSON_VALUE(AR.Content, '$.Email') LIKE '%' + @SearchText + '%')
			OR (@SearchWith = 'Phone' AND JSON_VALUE(AR.Content, '$.Phone') LIKE '%' + @SearchText + '%')
			OR ((@SearchWith = '' OR @SearchWith IS NULL) AND JSON_VALUE(AR.Content, '$.FullName') LIKE '%' + @SearchText + '%')
			OR ((@SearchWith = '' OR @SearchWith IS NULL) AND JSON_VALUE(AR.Content, '$.EmployeeCode') LIKE '%' + @SearchText + '%')
		)
    ORDER BY AR.Id DESC 
    OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END