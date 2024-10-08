CREATE OR ALTER PROCEDURE [dbo].[vendor_selected_details]
	@Id	INT
AS
BEGIN
		SELECT
			T.OfficeName,
            VI.[Name],
			V.VendorCode,
            VI.[Address],
			S.[Name] AS [State],
			C.[Name] AS City,
			VI.Pincode,
			VI.ContactName,
			VI.Email,
			VI.ContactNumberOneCountryCode,
			VI.ContactNumberTwoCountryCode,
			VI.ContactNumberOne,
			VI.ContactNumberTwo,
			VI.CreditPeriodInDays,
			VI.GstNumber,
			GstVendorType.[Name] AS GstVendorType,
			VI.TanNumber,
			VI.CinNumber,
			VI.ArnNumber,
			VI.EsiNumber,
			VI.PanNumber,
			PanType.[Name] AS PanType,
			VendorType.[Name] AS VendorType,
			VI.IsMsme,
			VI.MsmeRegistrationNumber,
			VI.MsmeCommencementDate,
			VI.MsmeExpiryDate
		FROM 
			VendorInfo AS VI
			LEFT JOIN TenantOffice AS T ON VI.TenantOfficeId = T.Id
			LEFT JOIN Vendor AS V ON VI.VendorId = V.Id
			LEFT JOIN State AS S ON VI.StateId = S.Id
			LEFT JOIN City AS C ON VI.CityId = C.Id
			LEFT JOIN MasterEntityData AS GstVendorType ON GstVendorType.Id = GstVendorTypeId
			LEFT JOIN MasterEntityData AS PanType ON PanType.Id = PanTypeId
			LEFT JOIN MasterEntityData AS VendorType ON VendorType.Id = VendorTypeId
		WHERE
			VI.VendorId = @Id AND
			VI.EffectiveTo IS NULL
END