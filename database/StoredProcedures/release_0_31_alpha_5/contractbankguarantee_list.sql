CREATE OR ALTER PROCEDURE [dbo].[contractbankguarantee_list]
	@ContractId INT
AS 
BEGIN 
	SET NOCOUNT ON;
	SELECT
		CBG.Id,
		GT.[Name] AS GuaranteeType,
		GS.[Name] AS GuaranteeStatus,
		GS.Id AS GuaranteeStatusId,
		CBG.GuaranteeNumber,
		CBG.GuaranteeAmount,
		BBI.BranchName,
		CBG.GuaranteeEndDate,
		CBG.GuaranteeClaimPeriodInDays,
		CBG.Remarks,
		CU.FullName as CreatedBy,
		CBG.CreatedOn
	FROM ContractBankGuarantee CBG
		LEFT JOIN MasterEntityData GT ON GT.Id = CBG.GuaranteeType
		LEFT JOIN MasterEntityData GS ON GS.Id = CBG.GuaranteeStatusId
		LEFT JOIN BankBranchInfo BBI ON BBI.Id = CBG.BankBranchInfoId
		LEFT JOIN UserInfo CU ON CU.Id = CBG.CreatedBy
	WHERE
		CBG.ContractId = @ContractId
	ORDER BY
		CBG.Id DESC 
END 