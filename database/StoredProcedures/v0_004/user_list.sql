CREATE OR ALTER PROCEDURE [dbo].[user_list]
    @Page INT = 1,
    @PerPage INT = 10,
    @SearchText VARCHAR(50) = NULL,
	@SearchWith VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @Page < 1
    SET @Page = 1;

    SELECT
          U.Id,
          U.EmployeeCode,
          U.FullName,
		  Department.[Name] AS Department,
          Designation.[Name] AS Designation,
		  TenantOffice.OfficeName AS [Location],
          Gender.[Name] AS Gender,
		  U.Email,
		  U.Phone,
          U.IsActive AS UserInfoStatus,
		  UserLogin.IsActive AS UserLoginStatus,
		  U.IsDeleted,
		  UC.[Name] AS UserCategory,
		  U.DocumentUrl
	FROM UserInfo U
		 LEFT JOIN UserLogin ON UserLogin.Id = U.UserLoginId
		 LEFT JOIN MasterEntityData Department ON U.DepartmentId = Department.Id
		 LEFT JOIN MasterEntityData Gender ON U.GenderId = Gender.Id
		 LEFT JOIN MasterEntityData UC ON UC.Id = U.UserCategoryId
		 LEFT JOIN Designation ON U.DesignationId = Designation.Id
		 LEFT JOIN TenantOffice ON TenantOffice.Id = U.TenantOfficeId
	WHERE
		U.IsDeleted = 0 AND
		(@SearchText IS NULL OR 
			(@SearchWith = 'Department' AND Department.[Name] LIKE '%' + @SearchText + '%')
			OR (@SearchWith = 'UserCategory' AND UC.[Name] LIKE '%' + @SearchText + '%')
			OR (@SearchWith = 'Gender' AND Gender.[Name] LIKE '%' + @SearchText + '%')
			OR (@SearchWith = 'TenantOfficeInfo' AND TenantOffice.OfficeName LIKE  '%'+ @SearchText + '%')
			OR (@SearchWith = 'Email' AND U.Email LIKE '%' + @SearchText + '%')
			OR (@SearchWith = 'Phone' AND U.Phone LIKE '%' + @SearchText + '%')
			OR ((@SearchWith = '' OR @SearchWith IS NULL) AND U.FullName LIKE '%' + @SearchText + '%')
			OR ((@SearchWith = '' OR @SearchWith IS NULL) AND U.EmployeeCode LIKE '%' + @SearchText + '%')
		)
        ORDER BY U.CreatedOn DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
  END;