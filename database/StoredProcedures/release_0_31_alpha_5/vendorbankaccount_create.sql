CREATE OR ALTER PROCEDURE [dbo].[vendorbankaccount_create]
    @VendorId INT,
    @VendorBranchId INT = NULL, 
    @BankBranchId INT, 
	@BankAccountTypeId INT,
	@AccountNumber VARCHAR(32),
	@CreatedBy INT
AS
BEGIN 
SET NOCOUNT ON;
    INSERT INTO VendorBankAccount
		(VendorId,
		VendorBranchId,
		BankBranchId,
		BankAccountTypeId,
		AccountNumber ,
		CreatedBy,
		CreatedOn)
    VALUES
		(@VendorId,
		@VendorBranchId,
		@BankBranchId,
		@BankAccountTypeId,
		@AccountNumber,
		@CreatedBy,
	    GETUTCDATE())
END