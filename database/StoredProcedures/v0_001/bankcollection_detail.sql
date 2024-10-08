CREATE OR ALTER PROCEDURE [dbo].[bankcollection_detail]
    @BankCollectionId INT
AS 
BEGIN 
    SET NOCOUNT ON;

    DECLARE @TotalReceiptAmount DECIMAL(16, 2);
    SELECT @TotalReceiptAmount = ISNULL(SUM(R.ReceiptAmount), 0)
    FROM Receipt R
    WHERE R.BankCollectionId = @BankCollectionId;

    SELECT 
        BC.Id,
        BC.TransactionAmount,
        BC.TransactionDate,
		BC.TransactionReferenceNumber,
        BC.ChequeRealizedOn,
        BC.ChequeReturnedOn,
        BC.ChequeReturnedReason,
        PM.Code PaymentMethodCode,
		PM.[Name] PaymentMethodName,
        @TotalReceiptAmount AS TotalReceiptAmount,
        CLU.FullName ClaimedBy,
        CI.NameOnPrint CustomerName
    FROM BankCollection BC
    LEFT JOIN UserInfo CU ON CU.Id = BC.CreatedBy
    LEFT JOIN UserInfo MU ON MU.Id = BC.ModifiedBy
    LEFT JOIN UserInfo CLU ON CLU.Id = BC.ClaimedBy 
    LEFT JOIN CustomerInfo CI ON CI.Id = BC.CustomerInfoId
    LEFT JOIN MasterEntityData PM ON PM.Id = BC.PaymentMethodId
    WHERE BC.Id = @BankCollectionId;
END;
