
CREATE  OR ALTER PROCEDURE [dbo].[tenantbankaccount_get_names]
AS 
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        TBA.Id,
        BBI.BranchName,
        B.BankName
    FROM 
	    BankBranchInfo BBI    
        LEFT JOIN TenantBankAccount TBA  ON BBI.Id = TBA.BankBranchInfoId
	    LEFT JOIN BankBranch BB ON BB.Id=BBI.BranchId
	    LEFT JOIN Bank B ON B.Id=BB.BankId
   WHERE 
		TBA.IsActive = 1 AND TBA.IsDeleted = 0 AND
        TBA.TenantId = 1
    ORDER BY TBA.Id DESC 
END