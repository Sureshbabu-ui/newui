CREATE OR ALTER PROCEDURE [dbo].[vendorbranches_list]
 AS
 BEGIN 
	SET NOCOUNT ON;
	SELECT 
		VB.Id,
		VB.[Name] AS VendorBranch
	FROM VendorBranch VB
		INNER JOIN Vendor V ON V.Id = VB.VendorId
		INNER JOIN VendorInfo VI ON VI.VendorId = V.Id
	WHERE 
		VI.IsActive = 1 AND VI.EffectiveTo IS NULL
END 