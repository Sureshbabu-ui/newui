CREATE OR ALTER PROCEDURE [dbo].[vendor_editdetails]
    @VendorId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        VI.Id,
        VI.VendorId,
        VI.TenantOfficeId,
        VI.Name,
        VI.Address,
        VI.CountryId,
        VI.StateId,
        VI.CityId,
        VI.Pincode,
        VI.ContactName,
        VI.Email,
        VI.ContactNumberOneCountryCode,
        VI.ContactNumberTwoCountryCode,
        VI.ContactNumberOne,
        VI.ContactNumberTwo,
        VI.CreditPeriodInDays,
        VI.GstNumber,
        VI.GstVendorTypeId,
        VI.TanNumber,
        VI.CinNumber,
        VI.ArnNumber,
        VI.EsiNumber,
        VI.PanNumber,
        VI.PanTypeId,
        VI.VendorTypeId,
        VI.IsMsme,
        VI.IsActive,
        VI.MsmeRegistrationNumber,
        VI.MsmeCommencementDate,
        VI.MsmeExpiryDate,
        MED.[Code] AS GstVendorTypeCode
    FROM 
        VendorInfo VI
    LEFT JOIN 
        MasterEntityData MED ON MED.Id = VI.GstVendorTypeId
    WHERE
        VI.Id = @VendorId;		
END