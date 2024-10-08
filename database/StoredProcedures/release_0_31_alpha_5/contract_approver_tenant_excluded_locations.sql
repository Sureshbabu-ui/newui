CREATE OR ALTER PROCEDURE [dbo].[contract_approver_tenant_excluded_locations]
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		TenantOffice.Id,
		TenantOffice.OfficeName
	FROM TenantOffice
	WHERE
		TenantOffice.Id NOT IN (SELECT DISTINCT TenantOfficeId FROM ContractApprovalFlow)
END