CREATE OR ALTER PROCEDURE [dbo].[vendorbankaccount_update]
	@Id INT,
	@VendorBranchId INT,
	@BankBranchId INT,
	@BankAccountTypeId INT,
	@AccountNumber VARCHAR(32),
	@IsActive BIT,
	@UpdatedBy INT
AS
BEGIN
SET NOCOUNT ON;
	UPDATE VendorBankAccount
	SET 
		VendorBranchId = @VendorBranchId,
		BankBranchId = @BankBranchId,
		BankAccountTypeId = @BankAccountTypeId,
		AccountNumber	= @AccountNumber,
		IsActive = @IsActive,
		UpdatedBy = @UpdatedBy,
		UpdatedOn = GETUTCDATE()
	WHERE
		Id = @Id
END