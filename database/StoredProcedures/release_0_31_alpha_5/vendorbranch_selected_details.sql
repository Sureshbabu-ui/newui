CREATE OR ALTER PROCEDURE [dbo].[vendorbranch_selected_details]
	@Id	INT
AS
BEGIN
	SELECT
		T.OfficeName,
        VB.[Name],
        VB.Code,
        VB.[Address],
		S.[Name] AS [State],
		C.[Name] AS City,
		VB.Pincode,
		VB.ContactName,
		VB.Email,
		VB.ContactNumberOneCountryCode,
		VB.ContactNumberTwoCountryCode,
		VB.ContactNumberOne,
		VB.ContactNumberTwo,
		VB.CreditPeriodInDays,
		VB.TollfreeNumber,
		VB.GstArn,
		VB.Remarks,
		VB.GstNumber,
		GstVendorType.Name AS GstVendorType
	FROM 
		VendorBranch AS VB
		LEFT JOIN TenantOffice AS T ON VB.TenantOfficeId = T.Id
		LEFT JOIN State AS S ON VB.StateId = S.Id
		LEFT JOIN City AS C ON VB.CityId = C.Id
		LEFT JOIN MasterEntityData AS GstVendorType ON GstVendorType.Id = GstVendorTypeId
	WHERE
		VB.Id = @Id		
END