CREATE OR ALTER   PROCEDURE [dbo].[assetproductcategory_list]
    @Page INT = 1,
    @PerPage INT = 5,
    @Search VARCHAR(50) = NULL
AS 
BEGIN 
    SET NOCOUNT ON;
    IF @Page < 1
        SET @Page = 1;
    SELECT
        APC.Id,
        APC.Code,
        APC.CategoryName,
		PPC.CategoryName AS PartProductCategory,
        APC.GeneralNotCovered,
        APC.SoftwareNotCovered,
		APC.HardwareNotCovered
    FROM AssetProductCategory APC
    LEFT JOIN PartProductCategory PPC ON PPC.Id = APC.PartProductCategoryId
    WHERE  
        APC.IsDeleted = 0 AND
        (@Search IS NULL OR
        (APC.CategoryName LIKE '%' + @Search + '%') OR
        (APC.Code LIKE '%' + @Search + '%'))
    ORDER BY 
        APC.CreatedOn DESC
    OFFSET 
        (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END