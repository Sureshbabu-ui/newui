CREATE OR ALTER PROCEDURE [dbo].[receipt_list_by_bankcollection]
    @BankCollectionId INT
AS 
BEGIN 
    SET NOCOUNT ON;

    DECLARE @TotalReceiptAmount DECIMAL(16, 2);
    SELECT @TotalReceiptAmount = ISNULL(SUM(R.ReceiptAmount), 0)
    FROM Receipt R
    WHERE R.BankCollectionId = @BankCollectionId;

    SELECT 
      R.Id,
	  R.ReceiptNumber,
	  R.ReceiptAmount
    FROM Receipt R
    WHERE R.BankCollectionId = @BankCollectionId AND
	  R.IsDeleted != 1;
END;
