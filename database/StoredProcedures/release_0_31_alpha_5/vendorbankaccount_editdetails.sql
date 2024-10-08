CREATE OR ALTER PROCEDURE [dbo].[vendorbankaccount_editdetails]
	@Id	INT
AS
BEGIN
	SELECT
		VBA.Id,
		VBA.VendorBranchId,
		VBA.BankBranchId,
		BB.BankId,
		VBA.BankAccountTypeId,
		VBA.AccountNumber,
		VBA.IsActive
	FROM 
		VendorBankAccount AS VBA
		JOIN BankBranch BB ON BB.Id = VBA.BankBranchId
	WHERE
		VBA.Id = @Id		
END