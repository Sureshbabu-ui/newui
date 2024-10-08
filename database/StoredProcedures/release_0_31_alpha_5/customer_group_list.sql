CREATE OR ALTER PROCEDURE [dbo].[customer_group_list] 
    @Page INT = 1,
    @PerPage INT = 5,
    @Search VARCHAR(50) = NULL
AS
BEGIN 
    SET NOCOUNT ON;

    IF @Page < 1
        SET @Page = 1;

    SELECT
        CG.Id,
        CG.GroupCode,
        CG.GroupName,
        CU.FullName AS CreatedBy,
        CG.CreatedOn
    FROM CustomerGroup CG
        LEFT JOIN UserInfo CU ON CU.Id = CG.CreatedBy
    WHERE
        (@Search IS NULL OR 
        CG.GroupName LIKE '%' + @Search + '%' OR 
        CG.GroupCode LIKE '%' + @Search + '%')
    ORDER BY
        CG.CreatedOn DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END 
