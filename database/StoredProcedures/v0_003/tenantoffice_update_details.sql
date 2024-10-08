CREATE OR ALTER PROCEDURE [dbo].[tenantoffice_update_details]
	@TenantOfficeId	INT
AS
BEGIN
	SELECT
		TOI.Id,
		T.Id AS TenantOfficeId,
		T.OfficeName,
		T.Code,
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
		TOI.Tin
	FROM 
		TenantOfficeInfo TOI
		LEFT JOIN TenantOffice T ON T.Id = TOI.TenantOfficeId
	WHERE
		TOI.Id = @TenantOfficeId	
END