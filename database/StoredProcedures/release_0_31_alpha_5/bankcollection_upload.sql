CREATE OR ALTER   PROCEDURE [dbo].[bankcollection_upload]
	@CreatedBy INT,
	@TenantBankAccountId INT,
   	@BankCollections NVARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @BankCollectionStatusId INT;
	SELECT @BankCollectionStatusId = Id FROM MasterEntityData WHERE Code = 'BCS_PNDG'
	DECLARE @CheqPaymentId INT= (SELECT Id FROM MasterEntityData WHERE Code='PYM_CHEQ')
	INSERT INTO BankCollection(
		TransactionDate,
		Particulars,
		TransactionAmount,
		BankCollectionStatusId,
		TenantBankAccountId,
		CreatedBy,
		CreatedOn)
		
    SELECT  
		CONVERT(DATETIME,TransactionDate,120) AS TransactionDate,
		Particulars,
		Deposit,
		@BankCollectionStatusId,	
		@TenantBankAccountId,
		@CreatedBy,
		SYSUTCDATETIME()
    FROM OPENJSON (@BankCollections)
    WITH
		(TransactionDate Date,
		Particulars varchar(128),
		Deposit decimal(16,2));
END