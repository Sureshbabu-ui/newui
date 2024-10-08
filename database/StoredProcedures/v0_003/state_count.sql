CREATE OR ALTER   PROCEDURE [dbo].[state_count] 
	@Search VARCHAR(50) = NULL,
	@TotalRows INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT
		@TotalRows = COUNT(State.Id)
	FROM State
	WHERE (@Search IS NULL OR State.[Name] LIKE '%' + @Search + '%')
	 AND State.IsDeleted = 0
     AND State.IsActive = 1
END