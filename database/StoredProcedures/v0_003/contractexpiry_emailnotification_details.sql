CREATE OR ALTER PROCEDURE[dbo].[contractexpiry_emailnotification_details] 
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @StatusId INT;

    SELECT @StatusId = Id 
    FROM MasterEntityData 
    WHERE Code = 'CTS_EXPR';

	SELECT 
		C.TenantOfficeId,
		CI.NameOnPrint,
		C.ContractNumber
	FROM
		Contract C
		INNER JOIN CustomerInfo CI ON CI.Id = C.CustomerInfoId		
    WHERE 
		CallExpiryDate < GETDATE() AND ContractStatusId != @StatusId; 
END;