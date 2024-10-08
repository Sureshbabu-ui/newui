CREATE OR ALTER PROCEDURE [dbo].[contractbankguarantee_update]
	@UpdatedBy INT,
	@BankGuaranteeId INT,
	@GuaranteeType INT,
	@GuaranteeNumber VARCHAR(32),
	@BankBranchInfoId INT,
	@GuaranteeAmount DECIMAL(16,2),
	@GuaranteeStartDate DATE,
	@GuaranteeEndDate DATE,
	@GuaranteeClaimPeriodInDays SMALLINT,
	@Remarks VARCHAR(128)
AS 
BEGIN 
    SET NOCOUNT ON;
	UPDATE ContractBankGuarantee 
	SET
		GuaranteeType = @GuaranteeType,
		GuaranteeNumber = @GuaranteeNumber,
		BankBranchInfoId = @BankBranchInfoId,
		GuaranteeAmount  = @GuaranteeAmount,
		GuaranteeStartDate = @GuaranteeStartDate,
		GuaranteeEndDate  = @GuaranteeEndDate,
		GuaranteeClaimPeriodInDays = @GuaranteeClaimPeriodInDays,
		Remarks	   = @Remarks,
		ModifiedOn = GETUTCDATE(),
		ModifiedBy = @UpdatedBy
	WHERE
		Id = @BankGuaranteeId	
END