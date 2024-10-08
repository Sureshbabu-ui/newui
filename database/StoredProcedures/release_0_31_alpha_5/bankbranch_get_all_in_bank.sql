CREATE OR ALTER PROCEDURE [dbo].[bankbranch_get_all_in_bank]
    @BankId INT
AS
BEGIN 
SET NOCOUNT ON;
	SELECT	
		BBI.Id,
		BBI.BranchId,
		BBI.BranchName 
	FROM BankBranchInfo BBI
	LEFT JOIN BankBranch BB ON BB.Id=BBI.BranchId
	LEFT JOIN Bank B ON B.Id=BB.BankId
    WHERE 
		BBI.EffectiveTo IS NULL AND
		BB.BankId = @BankId;
END