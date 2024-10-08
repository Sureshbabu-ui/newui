CREATE OR ALTER PROCEDURE [dbo].[besure_einvoice_salesregisterreturnresponse_list] 
 @InvoiceNos NVARCHAR(MAX)
AS 
BEGIN 
SET NOCOUNT ON;
SELECT
        SalesRegisterReturnResponse.InvoiceNo,
        AckNo,
        AckDate,
        UUID,
        Create_Date,
        CancelDate,
        IRN,
        SignedQRCode,
        SignedInvoice,
        SignedQrCodeImgUrl,
        QRImgSaved,
        QRImgName,
        ewb_number,
        ewb_date,
        Status,
        EwbValidTill,
        irn_status,
        ewb_status,
        irp,
        ErrorCode,
        ErrorMessage,
        HeaderUniqueID,
        UpdatedDateTime,
		EISent,
		EISuccess
    FROM
        SalesRegisterReturnResponse 
		LEFT JOIN SalesRegisterHeader ON SalesRegisterHeader.Invoiceno =SalesRegisterReturnResponse.InvoiceNo
		 WHERE SalesRegisterReturnResponse.InvoiceNo IN (SELECT VALUE FROM STRING_SPLIT(@InvoiceNos, ','));
END;
