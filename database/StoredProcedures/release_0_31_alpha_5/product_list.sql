CREATE OR ALTER PROCEDURE [dbo].[product_list]
    @Page INT = 1,
    @PerPage INT = 5,
    @Search VARCHAR(50) = NULL
AS
BEGIN 
    SET NOCOUNT ON;

    IF @Page < 1
        SET @Page = 1;

    SELECT
        P.Id,
        P.Code,
        P.ModelName,
        P.[Description],
        P.ManufacturingYear,
        P.AmcValue,
        PC.CategoryName AS Category,
        M.[Name] AS Make,
        CreatedUser.FullName AS CreatedBy,
        P.CreatedOn,
        P.IsDeleted
    FROM Product P
    LEFT JOIN UserInfo CreatedUser ON CreatedUser.Id = P.CreatedBy
    LEFT JOIN UserInfo UpdatedUser ON UpdatedUser.Id = P.UpdatedBy
    LEFT JOIN AssetProductCategory PC ON PC.Id = P.AssetProductCategoryId
    LEFT JOIN Make M ON M.Id = P.MakeId
    WHERE
        P.IsDeleted = 0 AND
         (@Search IS NULL OR
         P.ModelName LIKE '%' + @Search + '%' OR
         P.Code LIKE '%' + @Search + '%')
    ORDER BY 
        P.CreatedOn DESC
    OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END
