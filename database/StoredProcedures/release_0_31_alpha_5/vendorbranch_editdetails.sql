CREATE OR ALTER PROCEDURE [dbo].[vendorbranch_editdetails]
	@Id	INT
AS
BEGIN
	SELECT
		Id,
		Code,
		TenantOfficeId,
        [Name],
        [Address],
		CountryId,
		StateId,
		CityId,
		Pincode,
		ContactName,
		Email,
		ContactNumberOneCountryCode,
		ContactNumberTwoCountryCode,
		ContactNumberOne,
		ContactNumberTwo,
		TollfreeNumber,
		CreditPeriodInDays,
		GstNumber,
		Remarks,
		GstArn,
		GstVendorTypeId,
		IsActive
	FROM 
		VendorBranch
	WHERE
		Id = @Id		
END