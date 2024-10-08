CREATE OR ALTER   PROCEDURE [dbo].[bankcollection_cancel_Claim]
    @BankCollectionId INT,
    @CancelReason VARCHAR(64),
    @CancelledBy INT
AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @BCStatusPendingId INT;
	DECLARE @MappedAmount DECIMAL(16,2);
	
	SELECT @BCStatusPendingId = Id FROM MasterEntityData WHERE Code = 'BCS_PNDG';

	SELECT @MappedAmount = SUM(Receipt.ReceiptAmount)  FROM Receipt
	WHERE Receipt.BankCollectionId = @BankCollectionId AND Receipt.IsDeleted != 1;

	DECLARE @CustomerId INT = (SELECT CustomerId FROM CustomerInfo
	LEFT JOIN BankCollection ON BankCollection.CustomerInfoId = CustomerInfo.Id
	WHERE  BankCollection.Id =@BankCollectionId);

	BEGIN TRANSACTION

	UPDATE BankCollection 
	SET
		 PaymentMethodId=NULL,
		 TransactionReferenceNumber=NULL,
		 CustomerInfoId=NULL,
		 BankCollectionStatusId = @BCStatusPendingId,
		 ClaimedBy=NULL,
		 ClaimedOn=NULL
	 WHERE 
		BankCollection.Id=@BankCollectionId

	UPDATE Receipt
	SET
		IsDeleted = 1,
		DeletedBy = @CancelledBy,
		DeletedOn = GETUTCDATE(),
		DeletedReason = @CancelReason
	WHERE Receipt.BankCollectionId = @BankCollectionId

	UPDATE InvoiceReceipt
	SET
		IsActive = 0
	FROM
		InvoiceReceipt IR
		INNER JOIN Receipt R ON IR.ReceiptId = R.Id
	WHERE
		R.BankCollectionId = @BankCollectionId;

		;WITH SumAmounts AS (
			SELECT 
				IR.InvoiceId,
				SUM(IR.Amount) AS TotalAmount
			FROM 
				InvoiceReceipt IR
				INNER JOIN Receipt R ON IR.ReceiptId = R.Id
			WHERE 
				R.BankCollectionId = @BankCollectionId
			GROUP BY 
				IR.InvoiceId
		)

		UPDATE IR
		SET
			CollectedAmount = IR.CollectedAmount - SA.TotalAmount,
			OutstandingAmount = IR.OutstandingAmount + SA.TotalAmount
		FROM 
			InvoiceReconciliation IR
			INNER JOIN SumAmounts SA ON IR.InvoiceId = SA.InvoiceId;

	COMMIT TRANSACTION
END