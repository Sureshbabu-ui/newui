CREATE OR ALTER PROCEDURE [dbo].[partproductcategory_list]
    @Page INT = 1,
    @PerPage INT = 5,
    @Search VARCHAR(50) = NULL
AS 
BEGIN 
    SET NOCOUNT ON;
    IF @Page < 1
        SET @Page = 1;
    SELECT
        PPC.Id,
        PPC.Code,
        PPC.CategoryName,
        CreatedUser.FullName AS CreatedBy,
        PPC.CreatedOn,
        UpdatedUser.FullName AS UpdatedBy,
        PPC.UpdatedOn
    FROM PartProductCategory PPC
    LEFT JOIN UserInfo CreatedUser ON CreatedUser.Id = PPC.CreatedBy
    LEFT JOIN UserInfo UpdatedUser ON UpdatedUser.Id = PPC.UpdatedBy
    WHERE  
        PPC.IsDeleted = 0 AND
        (@Search IS NULL OR
        (PPC.CategoryName LIKE '%' + @Search + '%') OR
        (PPC.Code LIKE '%' + @Search + '%'))
    ORDER BY 
        PPC.CreatedOn DESC
    OFFSET 
        (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END