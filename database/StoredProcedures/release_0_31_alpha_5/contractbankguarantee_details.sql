CREATE OR ALTER  PROCEDURE [dbo].[contractbankguarantee_details]
  @BankGuaranteeId INT
AS
BEGIN
	SET NOCOUNT ON;
	SELECT
		Id,
		GuaranteeType,
		GuaranteeNumber,
		BankBranchInfoId,
		GuaranteeAmount,
		GuaranteeStartDate,
		GuaranteeEndDate,
		GuaranteeClaimPeriodInDays,
		Remarks
	FROM ContractBankGuarantee 
	WHERE
		Id = @BankGuaranteeId
END