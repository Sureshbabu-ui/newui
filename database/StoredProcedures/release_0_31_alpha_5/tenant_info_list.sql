CREATE OR ALTER PROCEDURE [dbo].[tenant_info_list]
    @Page        INT = 1,
    @PerPage     INT = 10,
    @Search      VARCHAR(50) = NULL
AS
BEGIN 
    SET NOCOUNT ON;
    IF @Page < 1
        SET @Page = 1;

    SELECT 
        TI.Id,
        T.TenantCode,
        TI.TenantId,
        TI.[Name],
        TI.NameOnPrint,
        TI.IsVerified, 
        TI.CreatedOn
    FROM TenantInfo TI
        JOIN Tenant T ON TI.TenantId = T.Id
    WHERE 
        (@Search IS NULL OR 
		TI.[Name] LIKE '%' + @Search + '%')
    ORDER BY 
        TI.Id DESC
    OFFSET 
        (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END
