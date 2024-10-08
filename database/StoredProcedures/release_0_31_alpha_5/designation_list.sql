CREATE OR ALTER PROCEDURE [dbo].[designation_list] 
    @Page INT = 1,
    @PerPage INT = 5,
    @Search VARCHAR(50) = NULL
AS 
BEGIN 
    SET NOCOUNT ON;

    IF @Page < 1
        SET @Page = 1;

    SELECT
        D.Id,
        D.Code,
        D.[Name],
        D.IsActive,
        CreatedUser.FullName AS CreatedByFullName,
        D.CreatedOn,
        UpdatedUser.FullName AS UpdatedByFullName,
        D.UpdatedOn
    FROM
        Designation D
        LEFT JOIN UserInfo CreatedUser ON CreatedUser.Id = D.CreatedBy
        LEFT JOIN UserInfo UpdatedUser ON UpdatedUser.Id = D.UpdatedBy
    WHERE
        (@Search IS NULL OR 
        D.[Name] LIKE '%' + @Search + '%' OR 
        D.Code LIKE '%' + @Search + '%')
    ORDER BY
        D.CreatedOn DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END
