CREATE OR ALTER     PROCEDURE [dbo].[state_list]
 @Page        INT = 1,
 @PerPage     INT = 10,
 @Search VARCHAR(50) = NULL
AS
BEGIN 
	SET NOCOUNT ON;
    SELECT 
		Id,
		IsActive,
		[Name],
		Code,
		CountryId,
		GstStateName,
		GstStateCode 
	FROM [State] S
	WHERE (@Search IS NULL OR S.[Name] LIKE '%' + @Search + '%')
	 AND S.IsDeleted = 0
     AND S.IsActive = 1
    ORDER BY S.CreatedOn DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END