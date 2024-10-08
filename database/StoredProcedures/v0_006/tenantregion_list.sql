CREATE OR ALTER PROCEDURE [dbo].[tenantregion_list] 
    @Page INT = 1,
    @PerPage INT = 10,
    @Search VARCHAR(50) = NULL
AS
BEGIN 
    SET NOCOUNT ON;

    IF @Page < 1
        SET @Page = 1;

    SELECT
        TR.Id,
        TR.Code,
        TR.RegionName,
        TR.TenantOfficeId,
        TR.IsActive,
        T.OfficeName AS TenantLocation,
        TOI.[Address] AS RegionAddress,
        City.[Name] AS CityName,
        [State].[Name] AS StateName,
        TOI.Pincode
    FROM
        TenantRegion TR
        LEFT JOIN TenantOffice T ON T.Id = TR.TenantOfficeId
        LEFT JOIN TenantOfficeInfo TOI ON TOI.TenantOfficeId = TR.TenantOfficeId AND TOI.EffectiveTo IS NULL
		JOIN City ON City.Id = TOI.CityId
		JOIN [State] ON [State].Id = TOI.StateId
    WHERE
		TOI.EffectiveTo Is NULL AND
        (@Search IS NULL OR 
		TR.RegionName LIKE '%' + @Search + '%')
    ORDER BY
        TR.Id DESC 
    OFFSET 
        (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END