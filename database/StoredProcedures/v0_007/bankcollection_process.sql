CREATE OR ALTER     PROCEDURE [dbo].[bankcollection_process]
    @BankCollectionId INT,
    @TransactionAmount DECIMAL(16, 2),
    @TransactionDate DATE,
    @CustomerInfoId INT,
    @PaymentMethodId INT,
    @TransactionReferenceNumber VARCHAR(64),
    @TenantBankAccountId INT,
    @ClaimedBy INT,
    @InvoiceReceiptDetail NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @BCStatusProcessingId INT;
	DECLARE @BCStatusCompleted INT;
	SELECT @BCStatusCompleted = Id FROM MasterEntityData WHERE Code = 'BCS_CPLT'
	SELECT @BCStatusProcessingId = Id FROM MasterEntityData WHERE Code = 'BCS_PRNG'
	BEGIN TRANSACTION

	UPDATE BankCollection 
	SET
		 PaymentMethodId=@PaymentMethodId,
		 TransactionReferenceNumber=@TransactionReferenceNumber,
		 CustomerInfoId=@CustomerInfoId,
		 BankCollectionStatusId = @BCStatusProcessingId,
		 ClaimedBy=@ClaimedBy,
		 ClaimedOn=GETUTCDATE()
	 WHERE 
		BankCollection.Id=@BankCollectionId

--Generating receipt number
	DECLARE @ReceiptNumber INT;
	DECLARE @TenantOfficeId INT;
		IF(@CustomerInfoId IS NOT NULL)
	BEGIN
	  SET @TenantOfficeId =(SELECT CustomerInfo.TenantOfficeId FROM CustomerInfo
							WHERE CustomerInfo.Id=@CustomerInfoId)

	 END
		 ELSE
	 BEGIN
	  SET @TenantOfficeId =(SELECT UserInfo.TenantOfficeId FROM UserInfo
							WHERE UserInfo.Id = @ClaimedBy) 
	 END
    
    DECLARE @CurrentDate DATETIME = GETUTCDATE()
	DECLARE @Year INT = YEAR(@CurrentDate)
	DECLARE @Month NVARCHAR(50) = MONTH(@CurrentDate)
	IF @Month < (SELECT AppKey FROM AppSetting WHERE AppKey='FyStartMonth')
      SET @Year = @Year - 1
	SET @Year = CONVERT(NVARCHAR(2), @Year)+ CONVERT(NVARCHAR(2),@Year + 1)
	  
	EXEC [dbo].[documentnumberformat_get_nextnumber]
		@DocumentTypeCode = 'DCT_RCPT',
		@Year = @Year,
		@TenantOfficeId = @TenantOfficeId,
		@DocumentNumber = @ReceiptNumber OUTPUT;
    	 
--End of receipt number generation

    INSERT INTO Receipt(
	    ReceiptNumber,
	    ReceiptAmount,
        ReceiptDate,
        CustomerInfoId,
        PaymentMethodId,
        TransactionReferenceNumber,
        TenantBankAccountId,
		BankCollectionId,
        CreatedBy,
        CreatedOn
    )
    VALUES (
	   @ReceiptNumber,
	   @TransactionAmount,
        GETUTCDATE(),
        @CustomerInfoId,
        @PaymentMethodId,
        @TransactionReferenceNumber,
        @TenantBankAccountId,
		@BankCollectionId,
			@ClaimedBy,
			GETUTCDATE()
    );
		Declare @ReceiptId INT; 
SET @ReceiptId = SCOPE_IDENTITY();

	INSERT INTO InvoiceReceipt(
	ReceiptId,
	InvoiceId,
	Amount
		)
	SELECT
	@ReceiptId,
	InvoiceId,
	Amount
    FROM OPENJSON(@InvoiceReceiptDetail)
	WITH(
	InvoiceId INT,
	Amount DECIMAL(16,2)
	)

	DECLARE @TotalInvoiceAmount DECIMAL(16, 2);

	SELECT @TotalInvoiceAmount = SUM(Amount) FROM InvoiceReceipt WHERE ReceiptId = @ReceiptId;

-- Update ReceiptAmount in the Receipt table

	UPDATE Receipt
	SET ReceiptAmount = @TotalInvoiceAmount
	WHERE Id = @ReceiptId;

	UPDATE InvoiceReconciliation SET 
		CollectedAmount = CollectedAmount+json.Amount,
		OutstandingAmount= NetInvoiceAmount -(CollectedAmount+json.Amount+GstTdsPaidAmount+TdsPaidAmount+PenaltyAmount+SecurityDepositAmount+CustomerExpenseAmount+OtherDeductionAmount+WriteOffAmount)
		FROM OPENJSON(@InvoiceReceiptDetail)
		WITH(
		InvoiceId INT,
		Amount DECIMAL(16,2)
		)  AS JSON   WHERE InvoiceReconciliation.InvoiceId=json.InvoiceId

DECLARE @TotalMappedAmount Decimal(16, 2)
SET @TotalMappedAmount=ISNULL((SELECT SUM(ReceiptAmount) FROM Receipt WHERE Receipt.BankCollectionId =@BankCollectionId),0)

	IF(@TotalMappedAmount = @TransactionAmount)
BEGIN
	UPDATE BankCollection SET BankCollectionStatusId=@BCStatusCompleted WHERE Id= @BankCollectionId
END
	ELSE 
BEGIN
	UPDATE BankCollection SET BankCollectionStatusId=@BCStatusProcessingId WHERE Id= @BankCollectionId
END
	COMMIT TRANSACTION
END
