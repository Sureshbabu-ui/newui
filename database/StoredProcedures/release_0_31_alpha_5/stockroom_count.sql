
CREATE OR ALTER PROCEDURE [dbo].[stockroom_count] 
	@Search VARCHAR(50) = NULL,
	@TotalRows INT OUTPUT
AS 
BEGIN 
	SET NOCOUNT ON;
	SELECT
		@TotalRows = COUNT(Id)
	FROM StockRoom
	WHERE
		IsActive = 1 AND
		(@Search IS NULL OR
		RoomName LIKE '%' + @Search + '%')
END 


