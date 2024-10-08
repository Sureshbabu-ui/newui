CREATE OR ALTER PROCEDURE [dbo].[division_list]
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
        CU.FullName AS CreatedByFullName,
        D.CreatedOn,
        UU.FullName AS UpdatedByFullName,
        D.UpdatedOn
    FROM Division D
    LEFT JOIN UserInfo CU ON CU.Id = D.CreatedBy
    LEFT JOIN UserInfo UU ON UU.Id = D.UpdatedBy
    WHERE D.IsDeleted = 0 AND
        (@Search IS NULL OR 
        D.[Name] LIKE '%' + @Search + '%' OR 
        D.Code LIKE '%' + @Search + '%')
    ORDER BY 
        D.CreatedOn DESC
    OFFSET 
        (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END
