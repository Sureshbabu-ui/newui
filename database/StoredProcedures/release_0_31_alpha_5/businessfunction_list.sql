CREATE OR ALTER PROCEDURE [dbo].[businessfunction_list] 
    @Page INT = 1,
    @PerPage INT = 10,
    @Search VARCHAR(50) = NULL
AS 
BEGIN 
    SET NOCOUNT ON;
    
    IF @Page < 1
        SET @Page = 1;

    SELECT  
        BF.Id,
        BF.BusinessFunctionCode,
        BF.BusinessFunctionName,
        BF.[Description],
        BF.IsActive,
        BM.BusinessModuleName,
        CU.FullName AS CreatedBy,
        BF.CreatedOn,
        UU.FullName AS UpdatedBy,
        BF.UpdatedOn
    FROM BusinessFunction BF
    LEFT JOIN UserInfo CU ON CU.Id = BF.CreatedBy
    LEFT JOIN UserInfo UU ON UU.Id = BF.UpdatedBy
    LEFT JOIN BusinessModule BM ON BM.Id = BF.BusinessModuleId
    WHERE 
        (@Search IS NULL OR 
        BF.BusinessFunctionName LIKE '%' + @Search + '%' OR 
        BF.BusinessFunctionCode LIKE '%' + @Search + '%' OR
        BM.BusinessModuleName LIKE '%' + @Search + '%')
    ORDER BY BF.Id DESC 
    OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY
END
