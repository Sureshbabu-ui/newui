CREATE OR ALTER PROCEDURE [dbo].[customerinfo_locationwise_getnames]
	@TenantOfficeId INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		CustomerInfo.Id,
		CustomerInfo.[Name],
		Customer.CustomerCode,
		CustomerInfo.BilledToAddress
	FROM CustomerInfo 
	INNER JOIN Customer ON Customer.Id = CustomerInfo.CustomerId
	WHERE 
		CustomerInfo.IsActive=1 AND 
		CustomerInfo.TenantOfficeId = @TenantOfficeId
END 