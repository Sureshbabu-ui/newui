CREATE OR ALTER PROCEDURE [dbo].[tenantbankaccount_details]
    @Id INT
AS 
BEGIN 
    SET NOCOUNT ON;
	SELECT 
		TBA.Id,
		BBI.BranchName,
		B.BankName,
		TBA.RelationshipManager,
		TBA.ContactNumber,
		TBA.AccountNumber,
		TBA.Email,
		CU.FullName AS CreatedUserName,
		UU.FullName AS UpdatedUserName,
		TBA.CreatedOn,
		TBA.UpdatedOn,
		BAT.[Name] AS BankAccountTypeName
	FROM TenantBankAccount TBA
		INNER JOIN BankBranchInfo BBI ON BBI.Id = TBA.BankBranchInfoId
		INNER JOIN BankBranch BB ON BB.Id=BBI.BranchId
		INNER JOIN Bank B ON B.Id=BB.BankId
		LEFT JOIN MasterEntityData BAT ON TBA.BankAccountTypeId = BAT.Id
		LEFT JOIN UserInfo CU ON TBA.CreatedBy = CU.Id
		LEFT JOIN UserInfo UU ON TBA.UpdatedBy = UU.Id
	WHERE 
		TBA.IsActive IS NOT NULL AND
		TBA.Id =@Id
END
