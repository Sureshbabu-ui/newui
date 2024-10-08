CREATE OR ALTER PROCEDURE [dbo].[country_list]
 @Page        INT = 1,
 @PerPage     INT = 10,
 @SearchWith VARCHAR(50) = NULL
AS
BEGIN 
	SET NOCOUNT ON;
    SELECT 
		C.Id, 
		C.[Name], 
		C.CallingCode,
		C.IsoThreeCode,
		C.IsoTwoCode,
		C.CurrencyCode,
		C.CurrencyName,
		C.CurrencySymbol
    FROM Country C
    WHERE C.IsDeleted = 0 AND @SearchWith IS NULL OR C.[Name] LIKE '%' + @SearchWith + '%'
    ORDER BY C.CreatedOn DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END