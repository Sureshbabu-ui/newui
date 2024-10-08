CREATE OR ALTER PROCEDURE [dbo].[city_list]
 @Page        INT = 1,
 @PerPage     INT = 10,
 @SearchWith INT = NULL,
 @Search VARCHAR(64) = NULL
AS
BEGIN 
	SET NOCOUNT ON;
    SELECT 
		C.Id, 
		C.[Name], 
		C.Code, 
        C.StateId,
		S.[Name] AS StateName,
        TenantOfficeId,
        T.OfficeName
    FROM City C
    JOIN [State] S ON C.StateId = S.Id
    LEFT JOIN TenantOffice T ON T.Id = C.TenantOfficeId
    WHERE C.IsDeleted = 0 AND
        (@SearchWith IS NULL OR C.StateId = @SearchWith AND (@Search IS NULL OR (C.Name LIKE + @Search + '%')))
    ORDER BY C.Id ASC
    OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END