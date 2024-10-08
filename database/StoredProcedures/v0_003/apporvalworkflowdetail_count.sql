CREATE OR ALTER PROCEDURE [dbo].[apporvalworkflowdetail_count]
	@Search VARCHAR(64) = NULL,
	@TotalRows INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;

    SELECT 
        @TotalRows=COUNT(AWFD.Id) 
    FROM
        ApprovalWorkFlowDetail  AWFD
        LEFT JOIN [Role] R  ON R.Id = AWFD.ApproverRoleId
		LEFT JOIN TenantOffice ON TenantOffice.Id = AWFD.TenantOfficeId
    WHERE
		 ( ISNULL(@Search, '') = '' OR
		 R.[Name] LIKE '%' + @Search + '%' OR
		 TenantOffice.OfficeName LIKE '%' + @Search + '%' 
		 )
END

