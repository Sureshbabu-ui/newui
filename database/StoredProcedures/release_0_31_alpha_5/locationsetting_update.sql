CREATE OR ALTER PROCEDURE [dbo].[locationsetting_update]
    @LocationSettingId INT,
    @LocationId INT,
    @LastContractNumber INT = NULL,
    @LastSaleInvoiceNumber INT = NULL,
    @LastPaidJobInvoiceNumber INT = NULL,
    @LastWorkOrderNumber INT = NULL,
    @LastReceiptNumber INT = NULL
AS
BEGIN 
    SET NOCOUNT ON;
	UPDATE LocationSetting
    SET
        LocationId = @LocationId,
        LastContractNumber = ISNULL(@LastContractNumber, LastContractNumber),
        LastSaleInvoiceNumber = ISNULL(@LastSaleInvoiceNumber, LastSaleInvoiceNumber),
        LastPaidJobInvoiceNumber = ISNULL(@LastPaidJobInvoiceNumber, LastPaidJobInvoiceNumber),
        LastWorkOrderNumber = ISNULL(@LastWorkOrderNumber, LastWorkOrderNumber),
        LastReceiptNumber = ISNULL(@LastReceiptNumber, LastReceiptNumber)
    WHERE
        Id = @LocationSettingId
END 