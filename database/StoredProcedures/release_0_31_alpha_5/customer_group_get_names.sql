CREATE OR ALTER  PROCEDURE [dbo].[customer_group_get_names]
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id,
		GroupName 
	FROM CustomerGroup 
	ORDER BY GroupName ASC;
END 