CREATE OR ALTER PROCEDURE [dbo].[city_count] 
	@SearchWith  VARCHAR(50) = NULL,
	@Search VARCHAR(64) = NULL,
	@TotalRows INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT
		@TotalRows = COUNT(C.Id)
	FROM City C
	JOIN [State] ON C.StateId = [State].Id
	WHERE
        (@SearchWith IS NULL OR C.StateId = @SearchWith AND (@Search IS NULL OR (C.Name LIKE + @Search + '%')))
END 
