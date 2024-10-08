CREATE OR ALTER PROCEDURE [dbo].[locationsetting_details]
	@LocationId	INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		 Id,
		 LastContractNumber,
		 LastPaidJobInvoiceNumber,
		 LastReceiptNumber,
		 LastSaleInvoiceNumber,
		 LastWorkOrderNumber,
		 LocationId
	FROM LocationSetting
	WHERE
		LocationId = @LocationId
END 