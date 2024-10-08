CREATE OR ALTER     PROCEDURE [dbo].[masterentity_get_table_names]
    @Page INT = 1,
    @PerPage INT = 10,
	@Search VARCHAR(50) = NULL
AS
BEGIN 
	SET NOCOUNT ON;
	 IF @Page < 1
        SET @Page = 1;
	SELECT
		Id,
		[Description] AS EntityType 
	FROM MasterEntity
	WHERE
	 (@Search IS NULL OR 
        MasterEntity.EntityType LIKE '%' + @Search + '%')
	ORDER BY EntityType ASC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END 
