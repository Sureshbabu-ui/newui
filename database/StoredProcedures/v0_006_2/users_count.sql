CREATE OR ALTER PROCEDURE [dbo].[users_count] 
    @SearchText VARCHAR(50) = NULL,
	@SearchWith VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS 
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		@TotalRows = COUNT(U.Id)
	FROM UserInfo U
		LEFT JOIN UserLogin ON UserLogin.Id = U.UserLoginId
		LEFT JOIN MasterEntityData Department ON U.DepartmentId = Department.Id
		LEFT JOIN MasterEntityData Gender ON U.GenderId = Gender.Id
		LEFT JOIN MasterEntityData UC ON UC.Id = U.UserCategoryId
		LEFT JOIN Designation ON U.DesignationId = Designation.Id
		LEFT JOIN TenantOffice ON TenantOffice.Id = U.TenantOfficeId
	WHERE U.IsDeleted = 0 AND
		(@SearchText IS NULL OR 
		(
			@SearchWith = 'Department' AND Department.[Name] LIKE '%' + @SearchText + '%')
		OR (@SearchWith = 'UserCategory' AND UC.[Name] LIKE '%' + @SearchText + '%')
		OR (@SearchWith = 'Gender' AND Gender.[Name] LIKE '%' + @SearchText + '%')
		OR (@SearchWith = 'TenantOfficeInfo' AND TenantOffice.OfficeName LIKE  '%'+ @SearchText + '%')
		OR (@SearchWith = 'Email' AND U.Email LIKE '%' + @SearchText + '%')
		OR (@SearchWith = 'Phone' AND U.Phone LIKE '%' + @SearchText + '%')
		OR ((@SearchWith = '' OR @SearchWith IS NULL) AND U.FullName LIKE '%' + @SearchText + '%')
		OR ((@SearchWith = '' OR @SearchWith IS NULL) AND U.EmployeeCode LIKE '%' + @SearchText + '%')
		)
END