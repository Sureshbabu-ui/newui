CREATE OR ALTER PROCEDURE [dbo].[make_list]
    @Page INT = 1,
    @PerPage INT = 5,
    @Search VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @Page < 1
        SET @Page = 1;

    SELECT
        M.Id,
        M.Code,
        M.[Name],
        CreatedUser.FullName AS CreatedBy,
        M.CreatedOn,
        UpdatedUser.FullName AS UpdatedBy,
        M.UpdatedOn
    FROM Make M
    LEFT JOIN UserInfo CreatedUser ON CreatedUser.Id = M.CreatedBy
    LEFT JOIN UserInfo UpdatedUser ON UpdatedUser.Id = M.UpdatedBy
    WHERE
        M.IsDeleted = 0 AND
        (@Search IS NULL OR 
        M.[Name] LIKE '%' + @Search + '%' OR 
        M.Code LIKE '%' + @Search + '%')
    ORDER BY
        M.CreatedOn DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END
