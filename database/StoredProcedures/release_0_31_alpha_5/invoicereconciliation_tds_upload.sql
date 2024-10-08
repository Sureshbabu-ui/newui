CREATE OR ALTER PROCEDURE [dbo].[invoicereconciliation_tds_upload]
    @UploadedBy INT,
    @InvoiceTdsDetail NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
     INSERT INTO InvoiceReconciliationTdsUpload (InvoiceId,
     TdsPaidAmount,
     UploadedBy,
     UploadedOn)
    SELECT 
        (SELECT TOP 1 Id FROM Invoice WHERE json.InvoiceNum = Invoice.InvoiceNumber) AS InvoiceId,
        json.TdsAmount AS TdsPaidAmount,
	    @UploadedBy,
	    GETUTCDATE()
    FROM
        OPENJSON(@InvoiceTdsDetail)
    WITH (
        InvoiceNum VARCHAR(32),
        TdsAmount DECIMAL(16,2)
    ) AS json;

    UPDATE InvoiceReconciliation
    SET 
        TdsPaidAmount = InvoiceReconciliation.TdsPaidAmount + json.TdsAmount,
        OutstandingAmount = OutstandingAmount - json.TdsAmount
		FROM InvoiceReconciliation 
    INNER JOIN (
        SELECT InvoiceNum, TdsAmount
        FROM OPENJSON(@InvoiceTdsDetail)
        WITH (
            InvoiceNum VARCHAR(32),
            TdsAmount DECIMAL(16,2)
        )
    ) AS json ON InvoiceReconciliation.InvoiceId = (SELECT TOP 1 Id FROM Invoice WHERE json.InvoiceNum = Invoice.InvoiceNumber);

    COMMIT TRANSACTION;
END;
