CREATE OR ALTER PROCEDURE [dbo].[role_get_names]
    @Page		INT=1,
    @PerPage    INT=10
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        Id,
        [Name] AS RoleName,
        IsActive
    FROM [Role]
    WHERE 
        IsActive=1 AND
		IsDeleted = 0
    ORDER BY Name ASC;
END 

