CREATE OR ALTER PROCEDURE [dbo].[tenant_office_info_list]
    @Page        INT = 1,
    @PerPage     INT = 10,
    @SearchWith  VARCHAR(50) = NULL
AS
BEGIN 
    SET NOCOUNT ON;
	DECLARE @TenantOfficeTypeId INT;
    SELECT @TenantOfficeTypeId = Id FROM MasterEntityData WHERE Code = 'TOT_AROF'
    IF @Page < 1
        SET @Page = 1;

    SELECT
        TenantOfficeInfo.Id,
        TenantOffice.OfficeName,
        TenantOfficeInfo.[Address],
        City.[Name] AS CityName,
        [State].[Name] AS StateName,
        TenantOfficeInfo.Pincode,
        Manager.FullName as ManagerName,
        TenantOfficeInfo.IsVerified,
        TenantRegion.RegionName
    FROM
        TenantOfficeInfo
    JOIN TenantOffice ON TenantOfficeInfo.TenantOfficeId = TenantOffice.Id
    JOIN City ON City.Id = TenantOfficeInfo.CityId
    JOIN [State] ON [State].Id = TenantOfficeInfo.StateId
    JOIN Country ON Country.Id = TenantOfficeInfo.CountryId
    JOIN [State] AS GstState ON GstState.Id = TenantOfficeInfo.GstStateId
    LEFT JOIN UserInfo AS Manager ON Manager.Id = TenantOfficeInfo.ManagerId
    LEFT JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
    WHERE TenantOfficeInfo.EffectiveTo Is NULL AND TenantOffice.IsDeleted = 0 AND
        (@SearchWith IS NULL  OR 
        TenantOffice.RegionId = @SearchWith) AND
        TenantOffice.OfficeTypeId = @TenantOfficeTypeId
    ORDER BY
        TenantOfficeInfo.Id DESC
    OFFSET
        (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END