CREATE OR ALTER PROCEDURE [dbo].[partindentrequest_approval_count] 
	@Search VARCHAR(50) = NULL,
    @AssetProductCategoryId INT = NULL,
	@TotalRows INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
	SELECT
		@TotalRows = COUNT(Id)
	FROM 
		PartIndentRequest 
	WHERE
		(@AssetProductCategoryId IS NULL OR AssetProductCategoryId = @AssetProductCategoryId) AND
        (ISNULL(@Search, '') = '' OR IndentRequestNumber LIKE '%' + @Search + '%') AND IsProcessed = 0
END