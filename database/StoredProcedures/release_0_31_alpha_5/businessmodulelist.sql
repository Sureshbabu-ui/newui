CREATE OR ALTER PROCEDURE [dbo].[businessmodule_list] 
    @Page INT = 1,
    @PerPage INT = 10,
    @Search VARCHAR(50) = NULL
AS 
BEGIN 
    SET NOCOUNT ON;
    
    IF @Page < 1
        SET @Page = 1;

    SELECT  
        BM.Id,
        BM.BusinessModuleName,
        BM.[Description],
        BM.IsActive,
        CU.FullName AS CreatedBy,
        BM.CreatedOn,
        UU.FullName AS UpdatedBy,
        BM.UpdatedOn
    FROM BusinessModule BM
    LEFT JOIN UserInfo CU ON CU.Id = BM.CreatedBy
    LEFT JOIN UserInfo UU ON UU.Id = BM.UpdatedBy
    WHERE 
        (@Search IS NULL OR 
        BM.BusinessModuleName LIKE '%' + @Search + '%')
    ORDER BY 
        BM.Id DESC 
    OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY
END
