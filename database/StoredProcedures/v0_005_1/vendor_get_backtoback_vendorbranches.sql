CREATE OR ALTER PROCEDURE [dbo].[vendor_get_backtoback_vendorbranches]
 AS
 BEGIN 
	SET NOCOUNT ON;
	DECLARE @BackToBackVendorId INT
	SELECT @BackToBackVendorId = Id FROM MasterEntityData WHERE Code = 'VTP_BTOB'

	SELECT 
		VB.Id,
		VB.[Name] AS VendorBranch
	FROM VendorBranch VB
		INNER JOIN Vendor V ON V.Id = VB.VendorId
		INNER JOIN VendorInfo VI ON VI.VendorId = V.Id
	WHERE 
		VI.VendorTypeId = @BackToBackVendorId  AND VI.IsActive = 1 AND VI.EffectiveTo IS NULL
END 