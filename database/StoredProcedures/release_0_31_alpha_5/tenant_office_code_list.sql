CREATE OR ALTER PROCEDURE [dbo].[tenant_office_code_list]
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id,
		Code 
	FROM TenantOffice 
	WHERE 
		TenantId = 1;
END 