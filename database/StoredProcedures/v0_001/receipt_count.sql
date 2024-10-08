CREATE OR ALTER PROCEDURE [dbo].[receipt_count]
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT
        @TotalRows = COUNT(R.Id)
    FROM Receipt R
    LEFT JOIN UserInfo CreatedUser ON R.CreatedBy = CreatedUser.Id
    LEFT JOIN UserInfo ModifiedUser ON R.ModifiedBy = ModifiedUser.Id
    LEFT JOIN CustomerInfo ON R.CustomerInfoId = CustomerInfo.Id 
    LEFT JOIN MasterEntityData AS PaymentMethod ON R.PaymentMethodId = PaymentMethod.Id
    WHERE
	    R.IsDeleted != 1 AND
        (@Search IS NULL OR 
        PaymentMethod.[Name] LIKE '%' + @Search + '%');
END
