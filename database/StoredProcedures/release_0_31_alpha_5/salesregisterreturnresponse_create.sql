CREATE OR ALTER PROCEDURE [dbo].[salesregisterreturnresponse_create]
    @CreatedBy INT,
    @ResponseList NVARCHAR(MAX)
AS 
BEGIN 
    SET NOCOUNT ON;

   BEGIN TRANSACTION

    INSERT INTO SalesRegisterReturnResponse (InvoiceNo, AckNo, AckDate, UUID, Create_Date, CancelDate, IRN, SignedQRCode, SignedInvoice, SignedQrCodeImgUrl, QRImgSaved, QRImgName, ewb_number, ewb_date, Status, EwbValidTill, irn_status, ewb_status, irp, ErrorCode, ErrorMessage, HeaderUniqueID, UpdatedDateTime)
	
	SELECT
	     InvoiceNo,
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
        UpdatedDateTime
    FROM OPENJSON(@ResponseList)
	WITH(
     InvoiceNo varchar(32),
        AckNo varchar(64),
        AckDate datetime,
        UUID uniqueidentifier,
        Create_Date datetime,
        CancelDate datetime,
        IRN varchar(512),
        SignedQRCode nvarchar(max),
        SignedInvoice nvarchar(max),
        SignedQrCodeImgUrl nvarchar(512),
        QRImgSaved bit,
        QRImgName varchar(64),
        ewb_number varchar(64),
        ewb_date datetime,
        Status varchar(16),
        EwbValidTill datetime,
        irn_status varchar(16),
        ewb_status varchar(16),
        irp varchar(128),
        ErrorCode varchar(16),
        ErrorMessage varchar(1024),
        HeaderUniqueID uniqueidentifier,
        UpdatedDateTime datetime
	)   
   
  UPDATE SalesRegisterHeader
  SET EISuccess = CASE WHEN tr.IRN IS NOT NULL THEN 1 ELSE 0 END 
  FROM OPENJSON(@ResponseList)
    WITH (
        InvoiceNo VARCHAR(32),
		IRN varchar(512)
    ) AS tr
    WHERE SalesRegisterHeader.InvoiceNo = tr.InvoiceNo;

COMMIT TRANSACTION
END
