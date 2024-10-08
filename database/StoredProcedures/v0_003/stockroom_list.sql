CREATE OR ALTER PROCEDURE [dbo].[stockroom_list] 
	@Search VARCHAR(50) = NULL
AS 
BEGIN 
	SET NOCOUNT ON;
	SELECT
		Id,
		RoomName,
		RoomCode,
		IsActive,
		[Description]
	FROM StockRoom
	WHERE
		@Search IS NULL OR
		RoomName LIKE '%' + @Search + '%'
	ORDER BY CreatedOn DESC
END