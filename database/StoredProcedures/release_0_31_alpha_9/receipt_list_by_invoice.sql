CREATE OR ALTER PROCEDURE [dbo].[receipt_list_by_invoice]
    @InvoiceId	INT,
    @UserInfoId	INT
AS
BEGIN 
    SET NOCOUNT ON;
    DECLARE @UserCategory VARCHAR(64);
    DECLARE @UserOfficeId INT;
    DECLARE @UserRegionId INT;

    SELECT
        @UserCategory = UserCategory.Code,
        @UserOfficeId = TenantOfficeId,
        @UserRegionId = RegionId
    FROM UserInfo
        LEFT JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
        INNER JOIN MasterEntityData AS UserCategory ON UserInfo.UserCategoryId = UserCategory.Id
    WHERE
        UserInfo.Id = @UserInfoId;

	SELECT
        IR.Amount MappedAmount,
        R.ReceiptNumber,
		R.ReceiptAmount,
		R.ReceiptDate,
	    (I.InvoiceAmount + I.Sgst +I.Cgst +I.Igst -I.DeductionAmount) AS InvoiceAmount
    FROM Invoice I
	INNER JOIN InvoiceReceipt IR ON I.Id=IR.InvoiceId
    INNER JOIN Receipt R ON R.Id=IR.ReceiptId
    INNER JOIN ContractInvoice ON ContractInvoice.InvoiceId =I.Id
	INNER JOIN [Contract] C ON C.Id=ContractInvoice.ContractId 
	INNER JOIN CustomerInfo CI on CI.CustomerId = C.CustomerId AND CI.EffectiveTo IS NULL
    INNER JOIN TenantOffice ON TenantOffice.Id = C.TenantOfficeId
	WHERE I.Id = @InvoiceId  AND
	      (
            @UserCategory = 'UCT_FRHO'
            OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = C.TenantOfficeId)
            OR (@UserCategory = 'UCT_FRRO' AND TenantOffice.RegionId = @UserRegionId)
           )
END