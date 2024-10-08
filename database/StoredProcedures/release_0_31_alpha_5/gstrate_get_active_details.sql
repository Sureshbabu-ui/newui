CREATE OR ALTER PROCEDURE [dbo].[gstrate_get_active_details]
AS
BEGIN
    SET NOCOUNT ON;
	SELECT
		TenantServiceCode,
		ServiceAccountDescription,
		Cgst,
		Sgst,
		Igst
	FROM GstRate
	WHERE 
		IsActive = 1				
END