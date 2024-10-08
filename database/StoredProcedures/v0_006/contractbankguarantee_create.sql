CREATE OR ALTER PROCEDURE [dbo].[contractbankguarantee_create]
	@CreatedBy INT,
	@ContractId INT,
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
DECLARE @BankGuaranteeStatus INT

SELECT @BankGuaranteeStatus = Id FROM MasterEntityData WHERE Code = 'GRS_CRTD'
	INSERT INTO ContractBankGuarantee (
		ContractId,
		GuaranteeType,
		GuaranteeNumber,
		BankBranchInfoId,
		GuaranteeAmount,
		GuaranteeStartDate,
		GuaranteeEndDate,
		GuaranteeClaimPeriodInDays,
		Remarks,
		GuaranteeStatusId,
		CreatedBy,
		CreatedOn)
	VALUES (
		@ContractId ,
		@GuaranteeType,
		@GuaranteeNumber ,
		@BankBranchInfoId ,
		@GuaranteeAmount ,
		@GuaranteeStartDate,
		@GuaranteeEndDate ,
		@GuaranteeClaimPeriodInDays,
		@Remarks,
		@BankGuaranteeStatus,
		@CreatedBy,
		GETUTCDATE());
END 