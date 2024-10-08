CREATE OR ALTER PROCEDURE [dbo].[tenantregion_details]
	@TenantRegionId	INT
AS
BEGIN
	SELECT
		TR.Id,
		TR.Code,
		RegionName,
		TOI.Id AS TenantOfficeInfoId,
		T.Id AS TenantOfficeId,
		T.OfficeName,
		TOI.[Address],
		TOI.StateId,
		TOI.CityId,
		TOI.CountryId,
		TOI.Pincode,
		TOI.Phone,
		TOI.Email,
		TOI.Mobile,
		TOI.ManagerId,
		TOI.GstNumber,
		TOI.GstStateId,
		TOI.Tin,
		IsActive
	FROM TenantRegion TR
		LEFT JOIN TenantOffice T ON T.Id = TR.TenantOfficeId
		LEFT JOIN TenantOfficeInfo TOI ON TOI.TenantOfficeId = T.Id AND TOI.EffectiveTo IS NULL
	WHERE
		TR.Id = @TenantRegionId	
END