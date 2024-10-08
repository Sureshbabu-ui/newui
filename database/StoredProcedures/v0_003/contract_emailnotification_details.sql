CREATE OR ALTER     PROCEDURE [dbo].[contract_emailnotification_details]
	@ApproverId INT = NULL,
	@ContractId INT
AS 
BEGIN
	SET NOCOUNT ON;
	SELECT
		UI.FullName,
		UI.Email,
		C.TenantOfficeId,
		CI.NameOnPrint,
		C.ContractNumber
	FROM
		Contract C
		INNER JOIN CustomerInfo CI ON CI.Id = C.CustomerInfoId
		LEFT JOIN UserInfo UI ON UI.Id = @ApproverId
	WHERE
		C.Id = @ContractId
END