CREATE OR ALTER    PROCEDURE [dbo].[customer_edit_details]
	@CustomerId	INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT
		CI.Id,
		CI.[Name],
		C.CustomerCode,
		CI.CustomerId,
		CI.NameOnPrint,
		CI.CustomerGroupId,
		CI.TenantOfficeId,
		CI.PrimaryContactName,
		CI.PrimaryContactEmail,
		CI.PrimaryContactPhone,
		CI.SecondaryContactName,
		CI.SecondaryContactPhone,
		CI.SecondaryContactEmail,
		CI.PanNumber,
		CI.TinNumber,
		CI.TanNumber,
		CI.CinNumber,
		CI.BilledToAddress,
		CI.BilledToCityId,
		CI.BilledToStateId,
		CI.BilledToCountryId,
		CI.BilledToPincode,
		CI.BilledToGstNumber,
		CI.ShippedToAddress,
		CI.ShippedToPincode,
		CI.GstTypeId,
		CI.ShippedToGstNumber,
		CI.ShippedToCityId,
		CI.ShippedToStateId,
		CI.ShippedToCountryId,
		CI.IsMsme,
		CI.MsmeRegistrationNumber,
		CI.IsContractCustomer,
		CI.CustomerIndustryId
	FROM CustomerInfo CI
	LEFT JOIN Customer C ON C.Id = CI.CustomerId
	WHERE
	   CI.Id = @CustomerId 
END
