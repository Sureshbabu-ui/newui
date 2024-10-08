CREATE OR ALTER  PROCEDURE [dbo].[vendorbankaccount_list]
    @Page        INT = 1,
    @PerPage     INT = 10,
    @VendorId INT
AS 
BEGIN 
SET NOCOUNT ON;
        SELECT 
            VBA.Id,
			VBA.AccountNumber,
			VBA.IsActive,
			BBI.BranchName AS BankBranchName,
			BBI.Ifsc,
			VB.[Name] AS VendorBranchName,
			BAT.[Name] AS AccountType
        FROM 
		    VendorBankAccount AS VBA            
            LEFT JOIN BankBranchInfo AS BBI  ON BBI.BranchId = VBA.BankBranchId AND BBI.EffectiveTo IS NULL
            LEFT JOIN VendorBranch AS VB  ON VB.Id = VBA.VendorBranchId
	        LEFT JOIN MasterEntityData AS BAT ON BAT.Id = VBA.BankAccountTypeId
        WHERE
			VBA.IsDeleted = 0 AND
			VBA.VendorId = @VendorId
        ORDER BY VBA.Id DESC 
			OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END