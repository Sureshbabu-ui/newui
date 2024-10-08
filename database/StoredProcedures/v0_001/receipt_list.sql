CREATE OR ALTER PROCEDURE [dbo].[receipt_list]
    @Page       INT = 1,
    @PerPage    INT = 10,
    @Search     VARCHAR(50) = NULL
AS
BEGIN 
    SET NOCOUNT ON;
    DECLARE @Query NVARCHAR(MAX);
    IF @Page < 1
        SET @Page = 1;
  
    SELECT
        R.Id,
        R.ReceiptNumber,
        R.ReceiptAmount,
        R.ReceiptDate,
        ISNULL(CI.NameOnPrint, R.CustomerName) AS CustomerName,
        PM.[Name] AS PaymentMethod
    FROM Receipt R
    LEFT JOIN CustomerInfo CI ON R.CustomerInfoId = CI.Id 
    INNER JOIN MasterEntityData PM ON R.PaymentMethodId = PM.Id
    WHERE
        ((@Search IS NULL OR 
        PM.[Name] LIKE '%' + @Search + '%') ) AND
		R.IsDeleted != 1
    ORDER BY
        R.Id DESC
    OFFSET (@Page - 1) * @PerPage ROWS
    FETCH NEXT @PerPage ROWS ONLY;
END
