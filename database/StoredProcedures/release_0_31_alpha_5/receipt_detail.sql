CREATE OR ALTER PROCEDURE [dbo].[receipt_detail]
    @ReceiptId	INT
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT
        R.Id,
        R.ReceiptNumber,
        R.ReceiptAmount,
        R.ReceiptDate,
        TransactionReferenceNumber,
        TBA.AccountNumber AS TenantBankAccount,
        ISNULL(CustomerInfo.NameOnPrint,R.CustomerName) AS CustomerName,
        PaymentMethod.[Name] AS PaymentMethod,
        CreatedUser.FullName AS CreatedUserName,
        ModifiedUser.FullName AS ModifiedUserName
    FROM Receipt R
    LEFT JOIN CustomerInfo ON R.CustomerInfoId=CustomerInfo.Id 
    LEFT JOIN TenantBankAccount AS TBA ON TBA.Id=R.TenantBankAccountId
    INNER JOIN MasterEntityData AS PaymentMethod ON R.PaymentMethodId = PaymentMethod.Id
    LEFT JOIN UserInfo CreatedUser ON R.CreatedBy = CreatedUser.Id
    LEFT JOIN UserInfo ModifiedUser ON R.ModifiedBy = ModifiedUser.Id
    WHERE
        R.Id = @ReceiptId
END