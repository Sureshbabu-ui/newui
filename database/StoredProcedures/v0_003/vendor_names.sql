CREATE OR ALTER PROCEDURE [dbo].[vendor_names]
@VendorTypeId INT
AS
BEGIN 
SET NOCOUNT ON;
	SELECT 
		Vendor.Id,
		VI.[Name],
		VI.[Address],
		VI.GstNumber,
		S.GstStateCode
	FROM 
		Vendor
		LEFT JOIN VendorInfo VI ON VI.VendorId = Vendor.Id
		LEFT JOIN [State] S ON S.Id = VI.StateId
	WHERE 
		VI.IsActive = 1 AND 
		EffectiveTo IS NULL AND
		VI.VendorTypeId = @VendorTypeId
END