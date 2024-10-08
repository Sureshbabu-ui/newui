CREATE OR ALTER PROCEDURE [dbo].[tenantoffice_details]
	@TenantOfficeId	INT
AS
BEGIN
	SELECT
		TOI.Id,
		TOI.TenantOfficeId,
		TOI.[Address],
		C.[Name] AS City,
		CO.[Name] AS Country,
		S.[Name] AS [State],
		TOI.Pincode,
		TOI.Phone,
		TOI.Email,
		TOI.Mobile,
		M.FullName AS Manager,
		TOI.GstNumber,
		TOI.Tin,
		TOI.EffectiveFrom,
		TOI.EffectiveTo,
		CB.FullName AS CreatedBy,
		TOI.CreatedOn,
		GS.[Name] AS GstState,
		TOI.IsVerified,
		T.Code,
		T.OfficeName AS TenantOfficeName,
		T.GeoLocation,
		OT.[Name] AS TenantOfficeType,
		TR.RegionName
	FROM 
		TenantOfficeInfo TOI
		LEFT JOIN TenantOffice T ON T.Id = TOI.TenantOfficeId
		LEFT JOIN City C ON C.Id = TOI.CityId
		LEFT JOIN Country CO ON CO.Id = TOI.CountryId
		LEFT JOIN [State] S ON S.Id = TOI.StateId
		LEFT JOIN UserInfo M ON M.Id = TOI.ManagerId
		LEFT JOIN [State] GS ON GS.Id = TOI.GstStateId
		LEFT JOIN TenantInfo TI ON TI.TenantId = T.TenantId
		LEFT JOIN TenantRegion TR ON TR.Id = T.RegionId
		LEFT JOIN UserInfo CB ON CB.Id = TOI.CreatedBy
		LEFT JOIN MasterEntityData OT ON OT.Id = T.OfficeTypeId
	WHERE
		TOI.Id = @TenantOfficeId	
END
