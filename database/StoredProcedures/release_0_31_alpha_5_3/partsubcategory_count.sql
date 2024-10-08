CREATE OR ALTER  PROCEDURE [dbo].[partsubcategory_count] 
	@Search VARCHAR(50) = NULL,
	@TotalRows INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
	SELECT
		@TotalRows = COUNT(PSC.Id)
	FROM PartSubCategory PSC
	WHERE
        (ISNULL(@Search, '') = '' OR 
		PSC.Code LIKE '%' + @Search + '%' OR 
		PSC.[Name] LIKE '%' + @Search + '%')
END  