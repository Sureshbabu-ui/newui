CREATE OR ALTER PROCEDURE [dbo].[tenantbankaccount_create]
    @TenantId INT,
    @BankBranchInfoId INT, 
	@RelationshipManager VARCHAR(32),
    @ContactNumber VARCHAR(16),
	@Email VARCHAR(64), 
	@BankAccountTypeId INT,
	@AccountNumber VARCHAR(32),
	@CreatedBy INT,
    @IsTenantBankAccountCreated  INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @LastInsertedId NVARCHAR(10);

    INSERT INTO TenantBankAccount(
		TenantId,
		BankBranchInfoId,
		RelationshipManager,
		ContactNumber,
		Email,
		BankAccountTypeId,
		AccountNumber ,
		CreatedBy,
		CreatedOn)
    VALUES
	(@TenantId,
	@BankBranchInfoId,
	@RelationshipManager,
	@ContactNumber,
	@Email,
	@BankAccountTypeId,
	@AccountNumber,
   @CreatedBy,
   GETUTCDATE())
    SET @LastInsertedId = 'SELECT SCOPE_IDENTITY()'
    IF (@LastInsertedId IS NOT NULL)
        SET @IsTenantBankAccountCreated  = 1
    ELSE
        SET @IsTenantBankAccountCreated = 0
END 
