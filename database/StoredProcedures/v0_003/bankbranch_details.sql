CREATE OR ALTER PROCEDURE [dbo].[bankbranch_details]
	@BankBranchInfoId INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT
		BBI.Id,
		BBI.BranchId,
		B.BankName,
		BBI.BranchName,
		BB.BranchCode,
		BBI.[Address],
		BB.BankId,
		BBI.CityId,
		BBI.StateId,
		BBI.CountryId,
		C.[Name] AS City,
		S.[Name] AS [State],
		CO.[Name] AS Country,
		BBI.Pincode,
		BBI.ContactPerson,
		BBI.ContactNumberOneCountryCode,
		BBI.ContactNumberOne,
		BBI.ContactNumberTwoCountryCode,
		BBI.ContactNumberTwo,
		BBI.Email,
		BBI.Ifsc,
		BBI.MicrCode,
		BBI.SwiftCode,
		UI.FullName AS CreatedBy,
		BBI.CreatedOn
	FROM BankBranchInfo BBI
	LEFT JOIN BankBranch BB ON BBI.BranchId = BB.Id
	LEFT JOIN City C ON BBI.CityId = C.Id
	LEFT JOIN [State] S ON BBI.StateId = S.Id
    LEFT JOIN Country CO ON BBI.CountryId =CO.Id
	LEFT JOIN  Bank B On B.Id = BB.BankId
	LEFT JOIN UserInfo UI ON UI.Id=BBI.CreatedBy
	WHERE 
		BBI.Id = @BankBranchInfoId 
END