CREATE OR ALTER PROCEDURE [dbo].[contractinvoice_share_info] 
    @ContractInvoiceId int
AS
BEGIN
    SET NOCOUNT ON; 
    SELECT 
        CustomerInfo.PrimaryContactName,
        CustomerInfo.PrimaryContactEmail,
        CustomerInfo.SecondaryContactEmail,
        [Contract].ContractNumber,
        I.InvoiceNumber,
        I.InvoiceDate
    FROM Invoice I
    LEFT JOIN ContractInvoice CI ON I.Id= CI.InvoiceId
    LEFT JOIN ContractInvoiceSchedule CIS ON CIS.Id=CI.ContractInvoiceScheduleId
    LEFT JOIN [Contract]  ON [Contract].Id=CI.ContractId
    LEFT JOIN CustomerInfo ON I.CustomerInfoId=CustomerInfo.Id
    WHERE
        CI.Id = @ContractInvoiceId;
END