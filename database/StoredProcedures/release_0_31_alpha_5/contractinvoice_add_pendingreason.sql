CREATE OR ALTER PROCEDURE [dbo].[contractinvoice_add_pendingreason] 
	@ContractInvoiceId INT,
	@InvoicePendingReason VARCHAR(128),
	@CreatedBy INT
AS
SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN
 SET @InvoicePendingReason = REPLACE(@InvoicePendingReason, CHAR(10), '\\n');  -- Replace line breaks

    -- Check if InvoicePendingReason is NULL
    IF (SELECT InvoicePendingReason FROM ContractInvoice WHERE Id = @ContractInvoiceId) IS NULL
    BEGIN

        -- If it's NULL, create a new JSON array with the provided reason
        UPDATE ContractInvoice
        SET InvoicePendingReason = JSON_QUERY('[{"Id":"' + CONVERT(NVARCHAR(36), NEWID()) + '","Reason":"' + @InvoicePendingReason + '","CreatedOn":"' + CONVERT(VARCHAR, GETUTCDATE(), 126) + '","CreatedBy":"' + (SELECT FullName FROM UserInfo WHERE UserInfo.Id=@CreatedBy)  + '"}]')
        WHERE Id = @ContractInvoiceId;
    END
    ELSE
    BEGIN
        -- If it's not NULL, append the new reason to the existing JSON array
        UPDATE ContractInvoice
        SET InvoicePendingReason = JSON_MODIFY(
            InvoicePendingReason, 
            'append $',
            JSON_QUERY('{"Id":"' + CONVERT(NVARCHAR(36), NEWID()) + '","Reason":"' + @InvoicePendingReason + '","CreatedOn":"' + CONVERT(NVARCHAR, GETUTCDATE(), 126) + '","CreatedBy":"' + (SELECT FullName FROM UserInfo WHERE UserInfo.Id=@CreatedBy) + '"}')
	
        )
        WHERE Id = @ContractInvoiceId;
    END
END
