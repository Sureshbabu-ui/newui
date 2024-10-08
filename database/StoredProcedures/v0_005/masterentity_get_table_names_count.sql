CREATE OR ALTER PROCEDURE [dbo].[masterentity_get_table_names_count]
 @TotalRows INT OUTPUT,
 @Search VARCHAR(50) = NULL
AS
BEGIN
SELECT @TotalRows = COUNT(Id)
FROM MasterEntity
WHERE
 (@Search IS NULL OR MasterEntity.EntityType LIKE '%' + @Search + '%')
END