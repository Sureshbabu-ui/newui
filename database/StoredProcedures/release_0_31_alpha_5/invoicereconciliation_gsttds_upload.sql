CREATE OR ALTER PROCEDURE [dbo].[invoicereconciliation_gsttds_upload]
    @UploadedBy INT,
    @InvoiceTdsDetail NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;

 INSERT INTO InvoiceReconciliationGstTdsUpload (InvoiceId,
 GstTdsPaidAmount,
 UploadedBy,
 UploadedOn)
SELECT 
    (SELECT TOP 1 Id FROM Invoice WHERE json.InvoiceNum = Invoice.InvoiceNumber) AS InvoiceId,
    json.GstTdsPaidAmount,
	@UploadedBy,
	GETUTCDATE()
FROM
    OPENJSON(@InvoiceTdsDetail)
WITH (
    InvoiceNum VARCHAR(32),
    GstTdsPaidAmount DECIMAL(16,2)
) AS json;

    UPDATE InvoiceReconciliation
    SET 
        GstTdsPaidAmount= InvoiceReconciliation.GstTdsPaidAmount + json.GstTdsPaidAmount,
        OutstandingAmount = OutstandingAmount - json.GstTdsPaidAmount
		FROM InvoiceReconciliation 
    INNER JOIN (
        SELECT InvoiceNum,  GstTdsPaidAmount
        FROM OPENJSON(@InvoiceTdsDetail)
        WITH (
            InvoiceNum VARCHAR(32),
            GstTdsPaidAmount DECIMAL(16,2)
        )
    ) AS json ON InvoiceReconciliation.InvoiceId = (SELECT TOP 1 Id FROM Invoice WHERE json.InvoiceNum = Invoice.InvoiceNumber);

    COMMIT TRANSACTION;
END;
