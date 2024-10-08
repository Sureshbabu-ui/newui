CREATE OR ALTER PROCEDURE [dbo].[country_count] 
	@SearchWith  VARCHAR(50) = NULL,
	@TotalRows INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT
		@TotalRows = COUNT(C.Id)
	FROM Country C
	WHERE @SearchWith IS NULL OR C.[Name] LIKE '%' + @SearchWith + '%'
END 
