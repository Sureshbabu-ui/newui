CREATE OR ALTER   PROCEDURE [dbo].[bankcollection_cheque_upload]
	@CreatedBy INT,
	@TenantBankAccountId INT,
   	@ChequeCollections NVARCHAR(MAX)
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
		PaymentMethodId,
		TenantBankAccountId,
		ChequeRealizedOn,
		ChequeReturnedOn,
		ChequeReturnedReason,
		CustomerBankName,
		CreatedBy,
		CreatedOn)
		
    SELECT  
		CONVERT(DATETIME,TransactionDate,120) AS TransactionDate,
		'CHEQUE/'+Particulars,
		Deposit,
		@BankCollectionStatusId,	
		@CheqPaymentId,
		@TenantBankAccountId,
		ChequeRealizedOn,
		ChequeReturnedOn,
		ChequeReturnedReason,
		CustomerBankName,
		@CreatedBy,
		SYSUTCDATETIME()
    FROM OPENJSON (@ChequeCollections)
    WITH
		(TransactionDate DATE,
		Particulars VARCHAR(128),
		Deposit DECIMAL(16,2),
		ChequeRealizedOn DATE,
		ChequeReturnedOn DATE,
		ChequeReturnedReason VARCHAR(128),
		CustomerBankName VARCHAR(128)
		);
END