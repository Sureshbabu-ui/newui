CREATE OR ALTER PROCEDURE [dbo].[bankcollection_list] 
    @BankCollectionStatus VARCHAR(8),
    @Page INT = 1,
    @PerPage INT = 10,
    @Search VARCHAR(50) = NULL
AS 
BEGIN 
    SET NOCOUNT ON;

    DECLARE @BankCollectionStatusId INT;
    SELECT @BankCollectionStatusId = Id FROM MasterEntityData WHERE Code = @BankCollectionStatus;

    IF @Page < 1
        SET @Page = 1;

    ;WITH ReceiptAmounts AS (
        SELECT 
            BankCollectionId,
            SUM(ReceiptAmount) AS TotalReceiptAmount
        FROM Receipt
        WHERE IsDeleted != 1
        GROUP BY BankCollectionId
    )
    SELECT 
        BC.Id,
        BC.Particulars,
        BC.TransactionAmount,
        BC.TransactionDate,
        BC.TenantBankAccountId,
        BC.CustomerInfoId,
        BC.ChequeRealizedOn,
        BC.ChequeReturnedOn,
        BC.ChequeReturnedReason,
        PM.Code AS PaymentMethodCode,
        COALESCE(RA.TotalReceiptAmount, 0) AS TotalReceiptAmount,
        CU.FullName AS CreatedBy,
        CLU.FullName AS ClaimedBy,
        CI.NameOnPrint AS CustomerName,
        BC.CreatedOn,
        MU.FullName AS UpdatedBy,
        BC.ModifiedOn
    FROM BankCollection BC
    LEFT JOIN UserInfo CU ON CU.Id = BC.CreatedBy
    LEFT JOIN UserInfo MU ON MU.Id = BC.ModifiedBy
    LEFT JOIN ReceiptAmounts RA ON RA.BankCollectionId = BC.Id
    LEFT JOIN UserInfo CLU ON CLU.Id = BC.ClaimedBy 
    LEFT JOIN CustomerInfo CI ON CI.Id = BC.CustomerInfoId
    LEFT JOIN MasterEntityData PM ON PM.Id = BC.PaymentMethodId
    WHERE 
        BC.BankCollectionStatusId = @BankCollectionStatusId AND
        (@Search IS NULL OR BC.Particulars LIKE '%' + @Search + '%')
    ORDER BY BC.Id DESC 
    OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END
