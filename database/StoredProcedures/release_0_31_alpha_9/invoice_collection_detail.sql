CREATE OR ALTER PROCEDURE [dbo].[invoice_collection_detail]
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
	    I.Id,
        I.InvoiceNumber,
		I.InvoiceDate,
        IR.CollectedAmount,
        IR.NetInvoiceAmount,
        IR.OutstandingAmount,
        IR.TdsDeductedAmount,
        IR.TdsPaidAmount,
        IR.GstTdsDeductedAmount,
        IR.GstTdsPaidAmount,
        IR.OtherDeductionAmount,
        IR.CustomerExpenseAmount,
        IR.SecurityDepositAmount,
        IR.PenaltyAmount,
        IR.WriteOffAmount,
        IR.CreatedOn,
		CI.NameOnPrint AS CustomerName,
		C.ContractNumber
    FROM Invoice I
    LEFT JOIN InvoiceReconciliation IR on I.Id = IR.InvoiceId
	LEFT JOIN ContractInvoice ON ContractInvoice.InvoiceId =I.Id
	LEFT JOIN [Contract] C ON C.Id=ContractInvoice.ContractId 
	LEFT JOIN CustomerInfo CI on CI.CustomerId = C.CustomerId AND CI.EffectiveTo IS NULL
    LEFT JOIN TenantOffice ON TenantOffice.Id = C.TenantOfficeId
    WHERE
        I.Id = @InvoiceId AND
	    (
            @UserCategory = 'UCT_FRHO'
            OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = C.TenantOfficeId)
            OR (@UserCategory = 'UCT_FRRO' AND TenantOffice.RegionId = @UserRegionId)
         )
END