CREATE OR ALTER PROCEDURE [dbo].[businessevent_list] 
    @Page INT = 1,
    @PerPage INT = 10,
    @Search VARCHAR(50) = NULL
AS 
BEGIN 
    SET NOCOUNT ON;
    IF @Page < 1
        SET @Page = 1;
    SELECT  
        BE.Id,
        BE.Code,
        BE.[Name],
        BE.IsActive,
        CU.FullName AS CreatedBy,
        BE.CreatedOn,
        CU.FullName AS UpdatedBy,
        BE.UpdatedOn
    FROM BusinessEvent BE
    LEFT JOIN UserInfo CU ON CU.Id = BE.CreatedBy
    LEFT JOIN UserInfo UU ON UU.Id = BE.UpdatedBy
    WHERE 
        (@Search IS NULL OR 
        BE.[Name] LIKE '%' + @Search + '%' OR 
        BE.Code LIKE '%' + @Search + '%')
    ORDER BY BE.Id DESC 
    OFFSET (@Page -1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY
END

SELECT * FROM BusinessEvent
