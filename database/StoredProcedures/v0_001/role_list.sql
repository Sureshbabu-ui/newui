CREATE OR ALTER PROCEDURE [dbo].[role_list] 
    @Page int = 1,
    @PerPage int = 5,
    @Search varchar(50) = NULL
AS 
BEGIN 
    SET NOCOUNT ON;
    IF @Page < 1
        SET @Page = 1;

    SELECT
        R.Id,
        R.[Name],
        R.IsActive,
		R.IsSystemRole,
        CreatedUser.FullName as CreatedBy,
        R.CreatedOn,
        UpdatedUser.FullName AS UpdatedBy,
        R.UpdatedOn
    FROM [Role] R
    LEFT JOIN UserInfo CreatedUser ON CreatedUser.Id = R.CreatedBy
    LEFT JOIN UserInfo UpdatedUser ON UpdatedUser.Id = R.UpdatedBy
    WHERE
        (@Search IS NULL OR 
        R.[Name] LIKE '%' + @Search + '%')  AND
		R.IsDeleted = 0
    ORDER BY
        R.CreatedOn DESC 
    OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END  
