CREATE OR ALTER PROCEDURE [dbo].[stockroom_names] 
AS 
BEGIN 
	SET NOCOUNT ON;
	SELECT
		Id,
		RoomName
	FROM StockRoom
	ORDER BY
		CreatedOn DESC
END